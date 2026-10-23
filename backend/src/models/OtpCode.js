const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

otpCodeSchema.index({ email: 1, code: 1 });
otpCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpCode = mongoose.model('OtpCode', otpCodeSchema);

module.exports = OtpCode;
