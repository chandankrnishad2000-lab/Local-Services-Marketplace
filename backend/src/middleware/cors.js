const cors = require('cors');

function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const envAllowed = process.env.FRONTEND_ORIGIN || '';
  const allowedOrigins = [envAllowed, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);

  const isLocalDev = origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const isAllowed = origin && (allowedOrigins.includes(origin) || isLocalDev);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}

module.exports = corsMiddleware;
