const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const LocalProProfile = require('../models/LocalProProfile');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripe = null;
if (SECRET_KEY) {
  stripe = require('stripe')(SECRET_KEY);
}

const isDummy = () => !stripe;

// POST /api/stripe/checkout - Create a Stripe Checkout Session (or dummy fallback)
router.post('/checkout', requireRole('CUSTOMER'), async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: 'Missing bookingId.' });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid bookingId.' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    const payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }
    if (payment.status === 'PAID') {
      return res.json({ url: null, message: 'Already paid' });
    }

    if (isDummy()) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'PAID' });
      return res.json({ url: null, message: 'Dummy checkout complete' });
    }

    const currency = booking.currency || 'inr';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Booking ${bookingId}` },
            unit_amount: booking.totalCents + booking.tipCents
          },
          quantity: 1
        }
      ],
      metadata: { bookingId: booking._id.toString() },
      success_url: `${FRONTEND_ORIGIN}/bookings/${booking._id.toString()}?payment=success`,
      cancel_url: `${FRONTEND_ORIGIN}/bookings/${booking._id.toString()}?payment=cancelled`
    });

    payment.stripeCheckoutSessionId = session.id;
    await payment.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/stripe/connect - Provider payout account (real or dummy)
router.post('/connect', requireRole('LOCAL_PRO'), async (req, res) => {
  try {
    const profile = await LocalProProfile.findOne({ userId: req.user.id });

    if (isDummy()) {
      const dummyAccount = 'acct_dummy_' + req.user.id;
      if (profile) {
        profile.stripeAccountId = dummyAccount;
        await profile.save();
      }
      return res.json({ ok: true, accountId: dummyAccount, url: null });
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Complete your Local Pro profile first.' });
    }

    if (profile.stripeAccountId && !profile.stripeAccountId.startsWith('acct_dummy_')) {
      // Return a dashboard link if already connected
      const link = await stripe.accounts.createLoginLink(profile.stripeAccountId);
      return res.json({ ok: true, accountId: profile.stripeAccountId, url: link.url });
    }

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'IN',
      email: req.user.email,
      capabilities: { transfers: { requested: true }, card_payments: { requested: true } }
    });

    profile.stripeAccountId = account.id;
    await profile.save();

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${FRONTEND_ORIGIN}/providers/dashboard?stripe=refresh`,
      return_url: `${FRONTEND_ORIGIN}/providers/dashboard?stripe=connected`,
      type: 'account_onboarding'
    });

    res.json({ ok: true, accountId: account.id, url: accountLink.url });
  } catch (err) {
    console.error('Stripe connect error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/stripe/webhook - Handle Stripe events (signature-verified or dummy)
router.post('/webhook', async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (isDummy() || !webhookSecret) {
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature error:', err.message);
    return res.status(400).json({ error: 'Invalid signature.' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
          return res.json({ received: true });
        }
        await Payment.findOneAndUpdate(
          { bookingId },
          { status: 'PAID', stripeCheckoutSessionId: session.id }
        );
        break;
      }
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        if (pi.metadata?.bookingId) {
          await Payment.findOneAndUpdate(
            { bookingId: pi.metadata.bookingId },
            { status: 'PAID', stripePaymentIntentId: pi.id }
          );
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('Stripe webhook handling error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }

  res.json({ received: true });
});

module.exports = router;
