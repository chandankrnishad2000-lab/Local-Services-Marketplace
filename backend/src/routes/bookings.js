const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const ServiceListing = require('../models/ServiceListing');
const MessageThread = require('../models/MessageThread');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

// GET /api/bookings
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({
      $or: [{ customerId: userId }, { localProId: userId }]
    }).sort({ createdAt: -1 }).lean();

    const listingIds = bookings.map(b => b.listingId);
    const paymentBookings = bookings.map(b => b._id);

    const [listings, payments, customerNames] = await Promise.all([
      ServiceListing.find({ _id: { $in: listingIds } }).select('title currency').lean(),
      Payment.find({ bookingId: { $in: paymentBookings } }).lean(),
      User.find({ _id: { $in: bookings.map(b => b.customerId) } }).select('name').lean()
    ]);

    const listingMap = {};
    listings.forEach(l => { listingMap[l._id.toString()] = l; });
    const paymentMap = {};
    payments.forEach(p => { paymentMap[p.bookingId.toString()] = p; });
    const customerMap = {};
    customerNames.forEach(c => { customerMap[c._id.toString()] = c; });

    const result = bookings.map(b => {
      const listing = listingMap[b.listingId.toString()] || {};
      const payment = paymentMap[b._id.toString()];
      const customer = customerMap[b.customerId.toString()] || {};

      return {
        id: b._id.toString(),
        listingId: b.listingId.toString(),
        listingTitle: listing.title || 'Unknown Listing',
        listingCurrency: listing.currency || 'inr',
        status: b.status,
        total_cents: b.totalCents,
        tip_cents: b.tipCents,
        notes: b.notes,
        start_at: b.startAt,
        end_at: b.endAt,
        created_at: b.createdAt,
        paymentStatus: payment?.status || null,
        customerName: customer.name || undefined
      };
    });

    res.json({ bookings: result });
  } catch (err) {
    console.error('Bookings GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/bookings
router.post('/', requireRole('CUSTOMER'), async (req, res) => {
  try {
    const { listingId, startAt, endAt, tipCents, notes } = req.body;

    if (!listingId || !startAt || !endAt) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(404).json({ error: 'Listing not available.' });
    }

    const listing = await ServiceListing.findById(listingId);
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Listing not available.' });
    }

    const tip = parseInt(tipCents, 10) || 0;

    const booking = await Booking.create({
      listingId: listing._id,
      customerId: new mongoose.Types.ObjectId(req.user.id),
      localProId: listing.localProId,
      status: 'PENDING',
      startAt,
      endAt,
      totalCents: listing.priceCents,
      tipCents: tip,
      notes: notes || null,
      createdAt: now()
    });

    await Payment.create({
      bookingId: booking._id,
      status: 'REQUIRES_PAYMENT',
      amountCents: listing.priceCents + tip,
      currency: listing.currency,
      platformFeeCents: 0,
      tipCents: tip,
      createdAt: now()
    });

    await MessageThread.create({
      bookingId: booking._id,
      createdAt: now()
    });

    res.json({ bookingId: booking._id.toString() });
  } catch (err) {
    console.error('Bookings POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/bookings/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const booking = await Booking.findById(id).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Not found.' });
    }

    if (booking.customerId.toString() !== req.user.id &&
        booking.localProId.toString() !== req.user.id &&
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const [listing, payment, customer, localPro] = await Promise.all([
      ServiceListing.findById(booking.listingId).select('title currency').lean(),
      Payment.findOne({ bookingId: booking._id }).lean(),
      User.findById(booking.customerId).select('name').lean(),
      User.findById(booking.localProId).select('name').lean()
    ]);

    res.json({
      booking: {
        id: booking._id.toString(),
        listingId: booking.listingId.toString(),
        listingTitle: listing?.title || 'Unknown',
        listingCurrency: listing?.currency || 'inr',
        customerName: customer?.name || 'Customer',
        localProName: localPro?.name || 'Local Pro',
        status: booking.status,
        total_cents: booking.totalCents,
        tip_cents: booking.tipCents,
        notes: booking.notes,
        start_at: booking.startAt,
        end_at: booking.endAt,
        created_at: booking.createdAt,
        paymentStatus: payment?.status || null
      }
    });
  } catch (err) {
    console.error('Bookings GET/:id error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/bookings/:id - Update booking status
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const isOwner = booking.customerId.toString() === req.user.id;
    const isProvider = booking.localProId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isProvider && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    if (isOwner && status !== 'CANCELLED') {
      return res.status(403).json({ error: 'Customers can only cancel bookings.' });
    }

    if (!isProvider && !isAdmin && status !== 'CANCELLED') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    if (!VALID_TRANSITIONS[booking.status]?.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from ${booking.status} to ${status}.` });
    }

    booking.status = status;
    await booking.save();

    res.json({ ok: true });
  } catch (err) {
    console.error('Bookings PATCH error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
