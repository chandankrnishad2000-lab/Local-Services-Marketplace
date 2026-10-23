const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceListing', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

reviewSchema.index({ listingId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
