const User = require('../models/User');

async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const user = await User.findById(req.session.userId).lean();
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
  next();
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return async (req, res, next) => {
    await requireAuth(req, res, () => {
      if (!allowed.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden.' });
      }
      next();
    });
  };
}

module.exports = { requireAuth, requireRole };
