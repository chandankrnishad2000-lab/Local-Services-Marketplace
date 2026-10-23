const mongoose = require('mongoose');

const messageThreadSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  createdAt: { type: String, required: true }
}, { timestamps: false, versionKey: false });



const MessageThread = mongoose.model('MessageThread', messageThreadSchema);

module.exports = MessageThread;
