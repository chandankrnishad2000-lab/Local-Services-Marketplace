const mongoose = require('mongoose');

const localProProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String, required: true },
  companyName: { type: String },
  bio: { type: String },
  phone: { type: String },
  location: { type: String },
  serviceArea: { type: String },
  yearsExperience: { type: Number },
  stripeAccountId: { type: String },
  approved: { type: Boolean, default: false },
  approvedAt: { type: String },
  verifiedAt: { type: String },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });



const LocalProProfile = mongoose.model('LocalProProfile', localProProfileSchema);

module.exports = LocalProProfile;
