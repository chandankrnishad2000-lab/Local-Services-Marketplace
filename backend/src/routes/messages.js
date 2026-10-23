const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const MessageThread = require('../models/MessageThread');
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

// GET /api/messages
router.get('/', requireAuth, async (req, res) => {
  try {
    const { threadId } = req.query;
    if (!threadId) {
      return res.status(400).json({ error: 'Missing threadId' });
    }

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({ error: 'Invalid threadId' });
    }

    const thread = await MessageThread.findById(threadId).lean();
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found.' });
    }

    const booking = await Booking.findById(thread.bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.customerId.toString() !== req.user.id &&
        booking.localProId.toString() !== req.user.id &&
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const messages = await Message.find({ threadId: thread._id })
      .populate('senderId', 'name')
      .sort({ createdAt: 1 })
      .lean();

    const result = messages.map(m => ({
      id: m._id.toString(),
      threadId: m.threadId.toString(),
      senderId: m.senderId?._id?.toString() || m.senderId?.toString(),
      senderName: m.senderId?.name || 'Unknown',
      body: m.body,
      created_at: m.createdAt
    }));

    res.json({ messages: result });
  } catch (err) {
    console.error('Messages GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/messages
router.post('/', requireAuth, async (req, res) => {
  try {
    const { threadId, body } = req.body;
    if (!threadId || !body) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
      return res.status(400).json({ error: 'Invalid threadId' });
    }

    const thread = await MessageThread.findById(threadId).lean();
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found.' });
    }

    const booking = await Booking.findById(thread.bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.customerId.toString() !== req.user.id &&
        booking.localProId.toString() !== req.user.id &&
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    await Message.create({
      threadId: thread._id,
      senderId: new mongoose.Types.ObjectId(req.user.id),
      body,
      createdAt: now()
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Messages POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
