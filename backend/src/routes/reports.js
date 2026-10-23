const express = require('express');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const ServiceListing = require('../models/ServiceListing');
const User = require('../models/User');
const { requireRole, requireAuth } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

// POST /api/reports - Report a listing (any logged-in user)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { listingId, reason } = req.body;
    if (!listingId || !reason) {
      return res.status(400).json({ error: 'listingId and reason are required.' });
    }
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: 'Invalid listingId.' });
    }
    if (String(reason).length > 500) {
      return res.status(400).json({ error: 'Reason is too long.' });
    }

    const listing = await ServiceListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    if (listing.localProId.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot report your own listing.' });
    }

    const openReport = await Report.findOne({
      reporterId: req.user.id,
      listingId,
      status: 'OPEN'
    });
    if (openReport) {
      return res.status(409).json({ error: 'You already reported this listing.' });
    }

    const report = await Report.create({
      reporterId: new mongoose.Types.ObjectId(req.user.id),
      listingId,
      reason: String(reason),
      status: 'OPEN',
      createdAt: now()
    });

    res.json({ id: report._id.toString() });
  } catch (err) {
    console.error('Reports POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/reports
router.get('/', requireRole('ADMIN'), async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const listingIds = reports.map(r => r.listingId);
    const reporterIds = reports.map(r => r.reporterId);

    const [listings, reporters] = await Promise.all([
      ServiceListing.find({ _id: { $in: listingIds } }).select('title').lean(),
      User.find({ _id: { $in: reporterIds } }).select('name').lean()
    ]);

    const listingMap = {};
    listings.forEach(l => { listingMap[l._id.toString()] = l; });
    const reporterMap = {};
    reporters.forEach(r => { reporterMap[r._id.toString()] = r; });

    const result = reports.map(r => ({
      id: r._id.toString(),
      listingId: r.listingId.toString(),
      listingTitle: listingMap[r.listingId.toString()]?.title || 'Unknown',
      reporterName: reporterMap[r.reporterId.toString()]?.name || 'Unknown',
      reason: r.reason,
      status: r.status,
      created_at: r.createdAt
    }));

    res.json({ reports: result });
  } catch (err) {
    console.error('Reports GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/reports/:id - Admin resolves or dismisses a report
router.patch('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const newStatus = action === 'RESOLVED' ? 'RESOLVED' : action === 'DISMISSED' ? 'DISMISSED' : null;
    if (!newStatus) {
      return res.status(400).json({ error: 'Action must be RESOLVED or DISMISSED.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: 'Not found.' });
    }
    if (report.status !== 'OPEN') {
      return res.status(400).json({ error: 'Report is already closed.' });
    }

    report.status = newStatus;
    await report.save();
    res.json({ ok: true, status: report.status });
  } catch (err) {
    console.error('Reports PATCH error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
