const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'LOCAL_PRO', 'ADMIN'], default: 'CUSTOMER', required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
