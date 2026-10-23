const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  status: { type: String, enum: ['REQUIRES_PAYMENT', 'PAID', 'FAILED', 'REFUNDED'], default: 'REQUIRES_PAYMENT', required: true },
  amountCents: { type: Number, required: true },
  currency: { type: String, default: 'inr', required: true },
  platformFeeCents: { type: Number, default: 0, required: true },
  tipCents: { type: Number, default: 0, required: true },
  stripeCheckoutSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
