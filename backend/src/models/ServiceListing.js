const mongoose = require('mongoose');

const serviceListingSchema = new mongoose.Schema({
  localProId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  durationMinutes: { type: Number, default: 60, required: true },
  priceCents: { type: Number, required: true },
  currency: { type: String, default: 'inr', required: true },
  location: { type: String, required: true },
  serviceArea: { type: String },
  highlights: [{ type: String }],
  requirements: [{ type: String }],
  imageUrl: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'REJECTED', 'DELETED'], default: 'PENDING', required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

serviceListingSchema.index({ status: 1 });
serviceListingSchema.index({ category: 1 });
serviceListingSchema.index({ location: 1 });
serviceListingSchema.index({ localProId: 1 });

const ServiceListing = mongoose.model('ServiceListing', serviceListingSchema);

module.exports = ServiceListing;
