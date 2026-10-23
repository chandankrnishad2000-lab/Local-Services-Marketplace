const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
  if (connected) return;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/local-services';
  await mongoose.connect(uri);
  connected = true;
  console.log('Connected to MongoDB');
}

module.exports = { connectDB, mongoose };
