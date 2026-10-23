const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageThread', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });

messageSchema.index({ threadId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
