const express = require('express');
const mongoose = require('mongoose');
const ServiceListing = require('../models/ServiceListing');
const User = require('../models/User');
const LocalProProfile = require('../models/LocalProProfile');
const Review = require('../models/Review');
const { requireAuth, requireRole } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

// GET /api/listings - Public listing search
router.get('/', async (req, res) => {
  try {
    const { q, category, location, minPrice, maxPrice, page = '1', limit = '24' } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 24));
    const skip = (pageNum - 1) * limitNum;

    const conditions = { status: 'ACTIVE' };

    if (category) conditions.category = category;
    if (location) conditions.location = { $regex: location, $options: 'i' };
    if (q) {
      conditions.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice) conditions.priceCents = { ...conditions.priceCents, $gte: parseInt(minPrice, 10) };
    if (maxPrice) conditions.priceCents = { ...conditions.priceCents, $lte: parseInt(maxPrice, 10) };

    const [rows, totalCount] = await Promise.all([
      ServiceListing.find(conditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ServiceListing.countDocuments(conditions)
    ]);

    const listingIds = rows.map(r => r._id);

    const [userMap, profileMap, reviewStats] = await Promise.all([
      User.find({ _id: { $in: rows.map(r => r.localProId) } }).select('name email').lean().then(users => {
        const map = {};
        users.forEach(u => { map[u._id.toString()] = u; });
        return map;
      }),
      LocalProProfile.find({ userId: { $in: rows.map(r => r.localProId) } }).lean().then(profiles => {
        const map = {};
        profiles.forEach(p => { map[p.userId.toString()] = p; });
        return map;
      }),
      Review.aggregate([
        { $match: { listingId: { $in: listingIds } } },
        { $group: { _id: '$listingId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
      ]).then(results => {
        const map = {};
        results.forEach(r => { map[r._id.toString()] = r; });
        return map;
      })
    ]);

    const listings = rows.map(row => {
      const id = row._id.toString();
      const user = userMap[row.localProId.toString()] || {};
      const profile = profileMap[row.localProId.toString()] || {};
      const stats = reviewStats[id] || {};

      return {
        id,
        local_pro_id: row.localProId.toString(),
        title: row.title,
        description: row.description,
        category: row.category,
        duration_minutes: row.durationMinutes,
        price_cents: row.priceCents,
        currency: row.currency,
        location: row.location,
        service_area: row.serviceArea,
        serviceArea: row.serviceArea,
        highlights: row.highlights || [],
        requirements: row.requirements || [],
        image_url: row.imageUrl,
        imageUrl: row.imageUrl,
        status: row.status,
        created_at: row.createdAt,
        localProName: user.name || 'Local Pro',
        localProEmail: user.email || '',
        localProPhone: profile.phone || '',
        localProCompany: profile.companyName || '',
        rating: stats.avgRating || null,
        reviewCount: stats.reviewCount || 0
      };
    });

    res.json({ listings, totalCount, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error('Listings GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/listings/me - Current LOCAL_PRO's own listings
router.get('/me', requireRole('LOCAL_PRO'), async (req, res) => {
  try {
    const rows = await ServiceListing.find({ localProId: new mongoose.Types.ObjectId(req.user.id) })
      .sort({ createdAt: -1 })
      .lean();

    const listingIds = rows.map(r => r._id);
    const reviewStats = await Review.aggregate([
      { $match: { listingId: { $in: listingIds } } },
      { $group: { _id: '$listingId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]).then(results => {
      const map = {};
      results.forEach(r => { map[r._id.toString()] = r; });
      return map;
    });

    const listings = rows.map(row => {
      const id = row._id.toString();
      const stats = reviewStats[id] || {};
      return {
        id,
        title: row.title,
        description: row.description,
        category: row.category,
        duration_minutes: row.durationMinutes,
        price_cents: row.priceCents,
        currency: row.currency,
        location: row.location,
        service_area: row.serviceArea,
        status: row.status,
        created_at: row.createdAt,
        rating: stats.avgRating || null,
        reviewCount: stats.reviewCount || 0
      };
    });

    res.json({ listings });
  } catch (err) {
    console.error('Listings ME error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/listings - Create listing (LOCAL_PRO)
router.post('/', requireRole('LOCAL_PRO'), async (req, res) => {
  try {
    const { title, description, category, location, priceCents, durationMinutes, currency, serviceArea, highlights, requirements, imageUrl } = req.body;

    if (!title || !description || !category || !location || !priceCents) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const parseList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      return val.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    };

    const listing = await ServiceListing.create({
      localProId: new mongoose.Types.ObjectId(req.user.id),
      title,
      description,
      category,
      durationMinutes: parseInt(durationMinutes, 10) || 60,
      priceCents: parseInt(priceCents, 10),
      currency: currency || 'inr',
      location,
      serviceArea: serviceArea || null,
      highlights: parseList(highlights),
      requirements: parseList(requirements),
      imageUrl: imageUrl || null,
      status: 'PENDING',
      createdAt: now()
    });

    res.json({ id: listing._id.toString() });
  } catch (err) {
    console.error('Listings POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/listings/admin - Admin listing management view (by status)
router.get('/admin', requireRole('ADMIN'), async (req, res) => {
  try {
    const { status = 'PENDING', q } = req.query;
    const requestedStatus = String(status).toUpperCase();
    const allowedStatuses = ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED'];
    const conditions = {};
    if (requestedStatus !== 'ALL') {
      if (!allowedStatuses.includes(requestedStatus)) {
        return res.status(400).json({ error: 'Invalid status.' });
      }
      conditions.status = requestedStatus;
    } else {
      conditions.status = { $in: allowedStatuses };
    }
    if (q) {
      conditions.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const rows = await ServiceListing.find(conditions)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const [userMap, profileMap, reviewStats] = await Promise.all([
      User.find({ _id: { $in: rows.map(r => r.localProId) } }).select('name email').lean().then(users => {
        const map = {};
        users.forEach(u => { map[u._id.toString()] = u; });
        return map;
      }),
      LocalProProfile.find({ userId: { $in: rows.map(r => r.localProId) } }).lean().then(profiles => {
        const map = {};
        profiles.forEach(p => { map[p.userId.toString()] = p; });
        return map;
      }),
      Review.aggregate([
        { $match: { listingId: { $in: rows.map(r => r._id) } } },
        { $group: { _id: '$listingId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
      ]).then(results => {
        const map = {};
        results.forEach(r => { map[r._id.toString()] = r; });
        return map;
      })
    ]);

    const listings = rows.map(row => {
      const id = row._id.toString();
      const user = userMap[row.localProId.toString()] || {};
      const profile = profileMap[row.localProId.toString()] || {};
      const stats = reviewStats[id] || {};

      return {
        id,
        title: row.title,
        category: row.category,
        location: row.location,
        price_cents: row.priceCents,
        currency: row.currency,
        status: row.status,
        created_at: row.createdAt,
        localProName: user.name || 'Local Pro',
        localProEmail: user.email || '',
        localProPhone: profile.phone || '',
        localProCompany: profile.companyName || '',
        rating: stats.avgRating || null,
        reviewCount: stats.reviewCount || 0
      };
    });

    res.json({ listings, status: requestedStatus });
  } catch (err) {
    console.error('Listings ADMIN error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/listings/:id - Get single listing
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const row = await ServiceListing.findById(id).lean();
    if (!row) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const [user, profile, reviewStats] = await Promise.all([
      User.findById(row.localProId).select('name email').lean(),
      LocalProProfile.findOne({ userId: row.localProId }).lean(),
      Review.aggregate([
        { $match: { listingId: row._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
      ])
    ]);

    const stats = reviewStats[0] || {};

    res.json({
      listing: {
        id: row._id.toString(),
        local_pro_id: row.localProId.toString(),
        title: row.title,
        description: row.description,
        category: row.category,
        duration_minutes: row.durationMinutes,
        price_cents: row.priceCents,
        currency: row.currency,
        location: row.location,
        service_area: row.serviceArea,
        serviceArea: row.serviceArea,
        highlights: row.highlights || [],
        requirements: row.requirements || [],
        image_url: row.imageUrl,
        imageUrl: row.imageUrl,
        status: row.status,
        created_at: row.createdAt,
        localProName: user?.name || 'Local Pro',
        localProEmail: user?.email || '',
        localProPhone: profile?.phone || '',
        localProCompany: profile?.companyName || '',
        rating: stats.avgRating || null,
        reviewCount: stats.reviewCount || 0
      }
    });
  } catch (err) {
    console.error('Listings GET/:id error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT|PATCH /api/listings/:id - Update listing (LOCAL_PRO, owner only)
router.put('/:id', requireRole('LOCAL_PRO'), updateListing);
router.patch('/:id', requireRole('LOCAL_PRO'), updateListing);

async function updateListing(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const listing = await ServiceListing.findById(id);
    if (!listing || listing.localProId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const { title, description, category, durationMinutes, priceCents, currency, location, serviceArea, highlights, requirements, imageUrl } = req.body;

    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (category !== undefined) listing.category = category;
    if (durationMinutes !== undefined) listing.durationMinutes = parseInt(durationMinutes, 10) || listing.durationMinutes;
    if (priceCents !== undefined) listing.priceCents = parseInt(priceCents, 10);
    if (currency !== undefined) listing.currency = currency;
    if (location !== undefined) listing.location = location;
    if (serviceArea !== undefined) listing.serviceArea = serviceArea;
    if (imageUrl !== undefined) listing.imageUrl = imageUrl;
    if (highlights !== undefined) {
      listing.highlights = Array.isArray(highlights) ? highlights : String(highlights).split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    }
    if (requirements !== undefined) {
      listing.requirements = Array.isArray(requirements) ? requirements : String(requirements).split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    }

    await listing.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Listings PUT error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
}

// DELETE /api/listings/:id
router.delete('/:id', requireRole('LOCAL_PRO'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const listing = await ServiceListing.findById(id);
    if (!listing || listing.localProId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    await ServiceListing.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Listings DELETE error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/listings/admin/:id/status - Admin approves/suspends/rejects a listing
router.patch('/admin/:id/status', requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['ACTIVE', 'INACTIVE', 'REJECTED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const listing = await ServiceListing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Not found.' });
    }

    listing.status = status;
    await listing.save();
    res.json({ ok: true, status: listing.status });
  } catch (err) {
    console.error('Listings ADMIN status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
