const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceListing', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  localProId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
    required: true
  },
  startAt: { type: String, required: true },
  endAt: { type: String, required: true },
  totalCents: { type: Number, required: true },
  tipCents: { type: Number, default: 0, required: true },
  notes: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

bookingSchema.index({ customerId: 1 });
bookingSchema.index({ localProId: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
