const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { requireRole } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

// GET /api/reviews?listingId=... - Public reviews for a listing
router.get('/', async (req, res) => {
  try {
    const { listingId } = req.query;
    if (!listingId) {
      return res.status(400).json({ error: 'Missing listingId' });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: 'Invalid listingId' });
    }

    const reviews = await Review.find({ listingId: new mongoose.Types.ObjectId(listingId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const userIds = reviews.map(r => r.customerId);
    const users = await mongoose.model('User').find({ _id: { $in: userIds } }).select('name').lean();
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u; });

    const result = reviews.map(r => ({
      id: r._id.toString(),
      bookingId: r.bookingId.toString(),
      rating: r.rating,
      comment: r.comment,
      customerName: userMap[r.customerId.toString()]?.name || 'Customer',
      created_at: r.createdAt
    }));

    res.json({ reviews: result });
  } catch (err) {
    console.error('Reviews GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/reviews
router.post('/', requireRole('CUSTOMER'), async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.customerId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Review can only be left on completed bookings.' });
    }

    const existingReview = await Review.findOne({ bookingId: booking._id });
    if (existingReview) {
      return res.status(409).json({ error: 'Review already exists for this booking.' });
    }

    await Review.create({
      bookingId: booking._id,
      listingId: booking.listingId,
      customerId: new mongoose.Types.ObjectId(req.user.id),
      rating: ratingNum,
      comment: comment || null,
      createdAt: now()
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Reviews POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
