const express = require('express');
const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User');
const { requireRole } = require('../middleware/auth');
const { now } = require('../helpers/now');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// POST /api/contact - Public contact form submission (saved to MongoDB)
router.post('/', async (req, res) => {
  try {
    const name = clean(req.body.name);
    const email = clean(req.body.email).toLowerCase();
    const phone = clean(req.body.phone);
    const subject = clean(req.body.subject);
    const message = clean(req.body.message);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }
    if (name.length > 120) {
      return res.status(400).json({ error: 'Name is too long.' });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (phone.length > 30) {
      return res.status(400).json({ error: 'Phone number is too long.' });
    }
    if (subject.length > 200) {
      return res.status(400).json({ error: 'Subject is too long.' });
    }
    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    // Attach the logged-in user when available (form also works for guests).
    let userId = null;
    if (req.session && req.session.userId && mongoose.Types.ObjectId.isValid(req.session.userId)) {
      const user = await User.findById(req.session.userId).select('_id').lean();
      if (user) userId = user._id;
    }

    const saved = await ContactMessage.create({
      userId,
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'NEW',
      createdAt: now()
    });

    res.json({ ok: true, id: saved._id.toString() });
  } catch (err) {
    console.error('Contact POST error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/contact - Admin inbox of contact form submissions
router.get('/', requireRole('ADMIN'), async (req, res) => {
  try {
    const { status } = req.query;
    const conditions = {};
    if (['NEW', 'READ', 'RESOLVED'].includes(status)) {
      conditions.status = status;
    }

    const messages = await ContactMessage.find(conditions)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    res.json({
      messages: messages.map((m) => ({
        id: m._id.toString(),
        userId: m.userId ? m.userId.toString() : null,
        name: m.name,
        email: m.email,
        phone: m.phone || null,
        subject: m.subject,
        message: m.message,
        status: m.status,
        created_at: m.createdAt
      }))
    });
  } catch (err) {
    console.error('Contact GET error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PATCH /api/contact/:id - Admin updates message status
router.patch('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['NEW', 'READ', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Not found.' });
    }

    message.status = status;
    await message.save();
    res.json({ ok: true, status: message.status });
  } catch (err) {
    console.error('Contact PATCH error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/contact/:id - Admin deletes a message
router.delete('/:id', requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Not found.' });
    }

    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Not found.' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Contact DELETE error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
