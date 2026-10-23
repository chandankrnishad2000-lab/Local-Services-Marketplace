const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceListing', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'RESOLVED', 'DISMISSED'], default: 'OPEN', required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

reportSchema.index({ status: 1 });
reportSchema.index({ listingId: 1 });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
