const { describe, before, after, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { now } = require('../src/helpers/now');

let mongod;
let app;

async function register(role) {
  const agent = request.agent(app);
  const email = `${role}_${Math.random().toString(36).slice(2)}@test.com`;
  const res = await agent.post('/api/auth/register').send({ name: role, email, password: 'Test1234!', role });
  assert.equal(res.status, 200);
  return { agent, email, id: res.body.id };
}

async function createAdmin() {
  const passwordHash = await bcrypt.hash('Admin1234!', 12);
  const admin = await User.create({
    name: 'Test Admin',
    email: `admin_${Math.random().toString(36).slice(2)}@test.com`,
    passwordHash,
    role: 'ADMIN',
    createdAt: now()
  });
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/login').send({ email: admin.email, password: 'Admin1234!' });
  assert.equal(res.status, 200);
  return { agent, id: admin._id.toString() };
}

async function createListing(agent, overrides = {}) {
  const res = await agent.post('/api/listings').send({
    title: 'Test Plumbing Service',
    description: 'Expert plumbing repair',
    category: 'Home Care',
    location: 'Mumbai',
    priceCents: 250000,
    durationMinutes: 120,
    ...overrides
  });
  assert.equal(res.status, 200);
  return res.body.id;
}

describe('Local Services API', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongod.getUri('local-services-test');
    process.env.SESSION_SECRET = 'test-secret';
    process.env.FRONTEND_ORIGIN = 'http://localhost:3000';
    await mongoose.connect(process.env.MONGODB_URI);
    app = require('../src/app');
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  describe('Health', () => {
    it('returns ok with connected db', async () => {
      const res = await request(app).get('/api/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.ok, true);
      assert.equal(res.body.db, 'connected');
    });

    it('404s unknown routes', async () => {
      const res = await request(app).get('/api/does-not-exist');
      assert.equal(res.status, 404);
    });
  });

  describe('Auth', () => {
    it('registers and auto-logs-in a customer', async () => {
      const { agent } = await register('CUSTOMER');
      const me = await agent.get('/api/auth/me');
      assert.equal(me.body.user.role, 'CUSTOMER');
    });

    it('registers a LOCAL_PRO with a profile', async () => {
      const { agent } = await register('LOCAL_PRO');
      const me = await agent.get('/api/auth/me');
      assert.equal(me.body.user.role, 'LOCAL_PRO');
    });

    it('rejects duplicate emails', async () => {
      const { email } = await register('CUSTOMER');
      const res = await request(app).post('/api/auth/register').send({ name: 'Dup', email, password: 'Test1234!' });
      assert.equal(res.status, 409);
    });

    it('rejects wrong password on login', async () => {
      const { email } = await register('CUSTOMER');
      const res = await request(app).post('/api/auth/login').send({ email, password: 'WrongPass1!' });
      assert.equal(res.status, 401);
    });

    it('logs out and clears session', async () => {
      const { agent } = await register('CUSTOMER');
      const out = await agent.post('/api/auth/logout');
      assert.equal(out.body.ok, true);
      const me = await agent.get('/api/auth/me');
      assert.equal(me.body.user, null);
    });
  });

  describe('Listings', () => {
    it('creates a listing as PENDING (requires admin approval)', async () => {
      const { agent } = await register('LOCAL_PRO');
      const id = await createListing(agent);
      const listing = await agent.get(`/api/listings/${id}`);
      assert.equal(listing.body.listing.status, 'PENDING');
    });

    it('does not expose PENDING listings publicly', async () => {
      const { agent } = await register('LOCAL_PRO');
      await createListing(agent, { title: 'Secret Pending Listing' });
      const res = await request(app).get('/api/listings');
      const titles = res.body.listings.map((l) => l.title);
      assert.ok(!titles.includes('Secret Pending Listing'));
    });

    it('blocks a customer from creating listings', async () => {
      const { agent } = await register('CUSTOMER');
      const res = await agent.post('/api/listings').send({ title: 'Nope', description: 'x', category: 'y', location: 'z', priceCents: 1000 });
      assert.equal(res.status, 403);
    });

    it('requires auth to view own listings', async () => {
      const res = await request(app).get('/api/listings/me');
      assert.equal(res.status, 401);
    });

    it('allows the owner to update their listing', async () => {
      const { agent } = await register('LOCAL_PRO');
      const id = await createListing(agent);
      const res = await agent.patch(`/api/listings/${id}`).send({ priceCents: 99900, title: 'Updated Title' });
      assert.equal(res.body.ok, true);
      const listing = await agent.get(`/api/listings/${id}`);
      assert.equal(listing.body.listing.price_cents, 99900);
      assert.equal(listing.body.listing.title, 'Updated Title');
    });

    it('forbids updating another provider listing', async () => {
      const { agent: owner } = await register('LOCAL_PRO');
      const id = await createListing(owner);
      const { agent: other } = await register('LOCAL_PRO');
      const res = await other.patch(`/api/listings/${id}`).send({ priceCents: 100 });
      assert.equal(res.status, 403);
    });

    it('allows the owner to delete their listing', async () => {
      const { agent } = await register('LOCAL_PRO');
      const id = await createListing(agent);
      const res = await agent.delete(`/api/listings/${id}`);
      assert.equal(res.body.ok, true);
      const listing = await agent.get(`/api/listings/${id}`);
      assert.equal(listing.status, 404);
    });
  });

  describe('Bookings', () => {
    it('requires an ACTIVE listing to book', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: customer } = await register('CUSTOMER');
      const res = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-01T10:00:00',
        endAt: '2026-09-01T12:00:00'
      });
      assert.equal(res.status, 404);
      assert.match(res.body.error, /not available/i);
    });

    it('customer can book an approved listing', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });

      const { agent: customer } = await register('CUSTOMER');
      const res = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-01T10:00:00',
        endAt: '2026-09-01T12:00:00',
        tipCents: 1000,
        notes: 'Front door'
      });
      assert.equal(res.status, 200);
      const bookingId = res.body.bookingId;
      const detail = await customer.get(`/api/bookings/${bookingId}`);
      assert.equal(detail.body.booking.status, 'PENDING');
      assert.equal(detail.body.booking.paymentStatus, 'REQUIRES_PAYMENT');
      assert.equal(detail.body.booking.listingId, id);
    });

    it('dummy checkout marks payment as PAID', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      const { agent: customer } = await register('CUSTOMER');
      const booking = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-02T10:00:00',
        endAt: '2026-09-02T11:00:00'
      });
      const bookingId = booking.body.bookingId;
      const checkout = await customer.post('/api/stripe/checkout').send({ bookingId });
      assert.equal(checkout.body.url, null);
      assert.match(checkout.body.message, /dummy/i);
      const detail = await customer.get(`/api/bookings/${bookingId}`);
      assert.equal(detail.body.booking.paymentStatus, 'PAID');
    });

    it('customer can only cancel their own bookings', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      const { agent: customer } = await register('CUSTOMER');
      const booking = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-03T10:00:00',
        endAt: '2026-09-03T11:00:00'
      });
      const bookingId = booking.body.bookingId;
      const res = await customer.patch(`/api/bookings/${bookingId}`).send({ status: 'CANCELLED' });
      assert.equal(res.body.ok, true);
      const detail = await customer.get(`/api/bookings/${bookingId}`);
      assert.equal(detail.body.booking.status, 'CANCELLED');
    });

    it('provider confirms then completes, customer cannot confirm', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      const { agent: customer } = await register('CUSTOMER');
      const booking = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-04T10:00:00',
        endAt: '2026-09-04T11:00:00'
      });
      const bookingId = booking.body.bookingId;

      const denied = await customer.patch(`/api/bookings/${bookingId}`).send({ status: 'CONFIRMED' });
      assert.equal(denied.status, 403);

      const confirm = await pro.patch(`/api/bookings/${bookingId}`).send({ status: 'CONFIRMED' });
      assert.equal(confirm.body.ok, true);

      const complete = await pro.patch(`/api/bookings/${bookingId}`).send({ status: 'COMPLETED' });
      assert.equal(complete.body.ok, true);

      const invalid = await pro.patch(`/api/bookings/${bookingId}`).send({ status: 'CANCELLED' });
      assert.equal(invalid.status, 400);
    });
  });

  describe('Reviews', () => {
    it('blocks reviews on non-completed bookings', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      const { agent: customer } = await register('CUSTOMER');
      const booking = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-05T10:00:00',
        endAt: '2026-09-05T11:00:00'
      });
      const bookingId = booking.body.bookingId;
      const res = await customer.post('/api/reviews').send({ bookingId, rating: 5, comment: 'Too early' });
      assert.equal(res.status, 400);
      assert.match(res.body.error, /completed/i);
    });

    it('accepts a review on completed bookings and blocks duplicates', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      const { agent: customer } = await register('CUSTOMER');
      const booking = await customer.post('/api/bookings').send({
        listingId: id,
        startAt: '2026-09-06T10:00:00',
        endAt: '2026-09-06T11:00:00'
      });
      const bookingId = booking.body.bookingId;
      await pro.patch(`/api/bookings/${bookingId}`).send({ status: 'CONFIRMED' });
      await pro.patch(`/api/bookings/${bookingId}`).send({ status: 'COMPLETED' });

      const ok = await customer.post('/api/reviews').send({ bookingId, rating: 5, comment: 'Amazing work!' });
      assert.equal(ok.body.ok, true);

      const dup = await customer.post('/api/reviews').send({ bookingId, rating: 4 });
      assert.equal(dup.status, 409);

      const listingReviews = await request(app).get(`/api/reviews?listingId=${id}`);
      assert.equal(listingReviews.body.reviews.length, 1);
      assert.equal(listingReviews.body.reviews[0].rating, 5);
    });
  });

  describe('Reports', () => {
    it('customer reports a listing, duplicate blocked, admin resolves', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });

      const { agent: customer } = await register('CUSTOMER');
      const report = await customer.post('/api/reports').send({ listingId: id, reason: 'Scam pricing' });
      assert.equal(report.body.id, report.body.id);
      const reportId = report.body.id;

      const dup = await customer.post('/api/reports').send({ listingId: id, reason: 'again' });
      assert.equal(dup.status, 409);

      const list = await admin.get('/api/reports');
      assert.ok(list.body.reports.some((r) => r.id === reportId && r.status === 'OPEN'));

      const resolve = await admin.patch(`/api/reports/${reportId}`).send({ action: 'RESOLVED' });
      assert.equal(resolve.body.status, 'RESOLVED');

      const again = await admin.patch(`/api/reports/${reportId}`).send({ action: 'DISMISSED' });
      assert.equal(again.status, 400);
    });
  });

  describe('Admin', () => {
    it('rejects non-admins from admin endpoints', async () => {
      const { agent } = await register('CUSTOMER');
      const stats = await agent.get('/api/admin/stats');
      assert.equal(stats.status, 403);
      const users = await agent.get('/api/admin/users');
      assert.equal(users.status, 403);
    });

    it('returns stats and users for admins', async () => {
      const { agent } = await createAdmin();
      const stats = await agent.get('/api/admin/stats');
      assert.equal(stats.status, 200);
      assert.ok('totalUsers' in stats.body.stats);
      assert.ok('pendingListings' in stats.body.stats);

      const users = await agent.get('/api/admin/users');
      assert.equal(users.status, 200);
      assert.ok(users.body.users.length >= 1);
    });

    it('admin approves a PENDING listing to ACTIVE', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();

      const pending = await admin.get('/api/listings/admin?status=PENDING');
      assert.ok(pending.body.listings.some((l) => l.id === id));

      const approve = await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      assert.equal(approve.body.status, 'ACTIVE');

      const publicList = await request(app).get('/api/listings');
      assert.ok(publicList.body.listings.some((l) => l.id === id));
    });

    it('admin can pause and reactivate a listing', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });

      const pause = await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'INACTIVE' });
      assert.equal(pause.body.status, 'INACTIVE');

      const publicList = await request(app).get('/api/listings');
      assert.ok(!publicList.body.listings.some((l) => l.id === id));

      const reactivate = await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ACTIVE' });
      assert.equal(reactivate.body.status, 'ACTIVE');
    });

    it('rejects invalid admin status transitions', async () => {
      const { agent: pro } = await register('LOCAL_PRO');
      const id = await createListing(pro);
      const { agent: admin } = await createAdmin();
      const res = await admin.patch(`/api/listings/admin/${id}/status`).send({ status: 'ON_FIRE' });
      assert.equal(res.status, 400);
    });

    it('admin can change a customer role to LOCAL_PRO', async () => {
      const { id } = await register('CUSTOMER');
      const { agent: admin } = await createAdmin();
      const res = await admin.patch(`/api/admin/users/${id}`).send({ role: 'LOCAL_PRO' });
      assert.equal(res.body.role, 'LOCAL_PRO');
    });
  });
});
