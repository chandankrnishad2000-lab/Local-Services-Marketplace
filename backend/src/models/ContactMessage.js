const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: null },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['NEW', 'READ', 'RESOLVED'], default: 'NEW', required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
