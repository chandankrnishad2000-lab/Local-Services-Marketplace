require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const corsMiddleware = require('./middleware/cors');

const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const bookingsRoutes = require('./routes/bookings');
const stripeRoutes = require('./routes/stripe');
const reviewsRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messages');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

app.use(corsMiddleware);

app.use(session({
  name: 'localpulse_session',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/local-services',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  const { mongoose } = require('./config/db');
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

module.exports = app;
