const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const ServiceListing = require('../models/ServiceListing');
const Report = require('../models/Report');
const Booking = require('../models/Booking');
const LocalProProfile = require('../models/LocalProProfile');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireRole('ADMIN'));

// GET /api/admin/stats - Dashboard overview counts
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalPros,
      totalListings,
      pendingListings,
      activeListings,
      openReports,
      totalBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'LOCAL_PRO' }),
      ServiceListing.countDocuments({ status: { $in: ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED'] } }),
      ServiceListing.countDocuments({ status: 'PENDING' }),
      ServiceListing.countDocuments({ status: 'ACTIVE' }),
      Report.countDocuments({ status: 'OPEN' }),
      Booking.countDocuments()
    ]);

    res.json({
      stats: {
        totalUsers,
        totalPros,
        totalListings,
        pendingListings,
        activeListings,
        openReports,
        totalBookings
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/admin/users - List users (with listing counts)
router.get('/users', async (req, res) => {
  try {
    const { q } = req.query;
    const conditions = {};
    if (q) {
      conditions.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const users = await User.find(conditions).sort({ createdAt: -1 }).limit(200).lean();
    const listingCounts = await ServiceListing.aggregate([
      { $match: { localProId: { $in: users.map(u => u._id) } } },
      { $group: { _id: '$localProId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    listingCounts.forEach(c => { countMap[c._id.toString()] = c.count; });

    const result = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.createdAt,
      listingCount: countMap[u._id.toString()] || 0
    }));

    res.json({ users: result });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/admin/users/:id - Update a user's role
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['CUSTOMER', 'LOCAL_PRO'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Not found.' });
    }

    user.role = role;
    await user.save();
    res.json({ ok: true, role: user.role });
  } catch (err) {
    console.error('Admin user patch error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/admin/users/:id/approve - Promote a LOCAL_PRO user (approve profile)
router.post('/users/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const user = await User.findById(id);
    if (!user || user.role !== 'LOCAL_PRO') {
      return res.status(404).json({ error: 'Not found.' });
    }

    await LocalProProfile.findOneAndUpdate(
      { userId: user._id },
      { approved: true, approvedAt: new Date().toISOString() },
      { upsert: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Admin approve error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
