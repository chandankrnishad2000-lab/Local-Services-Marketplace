const express = require('express');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const User = require('../models/User');
const LocalProProfile = require('../models/LocalProProfile');
const OtpCode = require('../models/OtpCode');
const { requireAuth } = require('../middleware/auth');
const { getOAuthStatus, generateAppleClientSecret } = require('../helpers/oauth');
const { now } = require('../helpers/now');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    let userRole = role || 'CUSTOMER';
    if (!['CUSTOMER', 'LOCAL_PRO'].includes(userRole)) {
      userRole = 'CUSTOMER';
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: userRole,
      createdAt: now()
    });

    if (userRole === 'LOCAL_PRO') {
      await LocalProProfile.create({
        userId: user._id,
        displayName: name,
        createdAt: now()
      });
    }

    req.session.userId = user._id.toString();
    res.json({ id: user._id.toString(), role: userRole });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    req.session.userId = user._id.toString();
    res.json({ id: user._id.toString(), role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed.' });
    }
    res.clearCookie('localpulse_session');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.json({ user: null });
  }

  const user = await User.findById(req.session.userId)
    .select('name email role createdAt')
    .lean();

  if (!user) {
    return res.json({ user: null });
  }

  res.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// GET /api/auth/oauth/status
router.get('/oauth/status', (req, res) => {
  res.json({ providers: getOAuthStatus() });
});

// GET /api/auth/oauth/google/start
router.get('/oauth/google/start', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Google OAuth not configured.' });
  }

  const state = require('crypto').randomBytes(16).toString('hex');
  req.session.oauthState = state;
  const role = req.query.role || 'CUSTOMER';
  req.session.oauthRole = ['CUSTOMER', 'LOCAL_PRO'].includes(role) ? role : 'CUSTOMER';

  const redirectUri = (process.env.BACKEND_BASE_URL || 'http://localhost:8000') + '/api/auth/oauth/google/callback';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account'
  });

  res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params.toString());
});

// GET /api/auth/oauth/google/callback
router.get('/oauth/google/callback', async (req, res) => {
  try {
    const { state, code } = req.query;
    if (!state || !code || !req.session.oauthState || state !== req.session.oauthState) {
      return res.status(400).json({ error: 'Invalid OAuth state.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = (process.env.BACKEND_BASE_URL || 'http://localhost:8000') + '/api/auth/oauth/google/callback';

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return res.status(400).json({ error: 'OAuth token exchange failed.' });
    }

    const profileRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: 'Bearer ' + accessToken }
    });

    const profile = await profileRes.json();
    if (profileRes.status !== 200) {
      return res.status(400).json({ error: 'Failed to fetch Google profile.' });
    }

    const email = profile.email;
    const name = profile.name || 'Google User';
    if (!email) {
      return res.status(400).json({ error: 'Google account email missing.' });
    }

    const role = req.session.oauthRole || 'CUSTOMER';
    const user = await getOrCreateUser(email, name, role);
    req.session.userId = user._id.toString();

    const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
    res.redirect(appBase + '/listings');
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    res.status(500).json({ error: 'OAuth callback failed.' });
  }
});

// GET /api/auth/oauth/apple/start
router.get('/oauth/apple/start', (req, res) => {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Apple OAuth not configured.' });
  }

  const state = require('crypto').randomBytes(16).toString('hex');
  req.session.oauthState = state;
  const role = req.query.role || 'CUSTOMER';
  req.session.oauthRole = ['CUSTOMER', 'LOCAL_PRO'].includes(role) ? role : 'CUSTOMER';

  const redirectUri = (process.env.BACKEND_BASE_URL || 'http://localhost:8000') + '/api/auth/oauth/apple/callback';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    response_mode: 'form_post',
    scope: 'name email',
    state
  });

  res.redirect('https://appleid.apple.com/auth/authorize?' + params.toString());
});

// POST /api/auth/oauth/apple/callback (also accepts GET)
router.all('/oauth/apple/callback', async (req, res) => {
  try {
    const state = req.body?.state || req.query?.state || '';
    const code = req.body?.code || req.query?.code || '';
    const userJson = req.body?.user || '';

    if (!state || !code || !req.session.oauthState || state !== req.session.oauthState) {
      return res.status(400).json({ error: 'Invalid OAuth state.' });
    }

    const clientId = process.env.APPLE_CLIENT_ID;
    const redirectUri = (process.env.BACKEND_BASE_URL || 'http://localhost:8000') + '/api/auth/oauth/apple/callback';
    let clientSecret = process.env.APPLE_CLIENT_SECRET;
    if (!clientSecret) {
      clientSecret = generateAppleClientSecret();
    }

    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) {
      return res.status(400).json({ error: 'Apple token exchange failed.' });
    }

    const parts = idToken.split('.');
    const payload = parts[1] ? JSON.parse(Buffer.from(parts[1], 'base64url').toString()) : {};
    let email = payload.email || '';
    let name = 'Apple User';

    if (userJson) {
      const userData = JSON.parse(userJson);
      if (userData.name) {
        const full = [userData.name.firstName, userData.name.lastName].filter(Boolean).join(' ');
        if (full) name = full;
      }
    }

    if (!email) {
      return res.status(400).json({ error: 'Apple account email missing.' });
    }

    const role = req.session.oauthRole || 'CUSTOMER';
    const user = await getOrCreateUser(email, name, role);
    req.session.userId = user._id.toString();

    const appBase = process.env.APP_BASE_URL || 'http://localhost:3000';
    res.redirect(appBase + '/listings');
  } catch (err) {
    console.error('Apple OAuth callback error:', err);
    res.status(500).json({ error: 'Apple OAuth callback failed.' });
  }
});

// POST /api/auth/otp/request
router.post('/otp/request', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required.' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpCode.create({
      email: email.toLowerCase(),
      code,
      expiresAt,
      verified: false,
      createdAt: now()
    });

    const response = {
      message: 'OTP sent (dummy).',
      expiresAt: expiresAt.toISOString()
    };

    if (process.env.NODE_ENV !== 'production') {
      response.code = code;
    }

    res.json(response);
  } catch (err) {
    console.error('OTP request error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/auth/otp/verify
router.post('/otp/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const otp = await OtpCode.findOne({
      email: email.toLowerCase(),
      code,
      verified: false
    }).sort({ createdAt: -1 });

    if (!otp) {
      return res.status(400).json({ error: 'Invalid OTP.' });
    }

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired.' });
    }

    otp.verified = true;
    await otp.save();

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: 'OTP User',
        email: email.toLowerCase(),
        passwordHash: await bcrypt.hash(require('crypto').randomBytes(16).toString('hex'), 12),
        role: 'CUSTOMER',
        createdAt: now()
      });
    }

    req.session.userId = user._id.toString();
    res.json({ id: user._id.toString(), role: user.role });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

async function getOrCreateUser(email, name, role) {
  let user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    if (role === 'LOCAL_PRO') {
      await ensureLocalProProfile(user._id, name);
    }
    return user;
  }

  user = await User.create({
    name: name || 'OAuth User',
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(require('crypto').randomBytes(12).toString('hex'), 12),
    role,
    createdAt: now()
  });

  if (role === 'LOCAL_PRO') {
    await ensureLocalProProfile(user._id, name || 'Local Pro');
  }

  return user;
}

async function ensureLocalProProfile(userId, displayName) {
  const existing = await LocalProProfile.findOne({ userId });
  if (existing) return;
  await LocalProProfile.create({ userId, displayName, createdAt: now() });
}

module.exports = router;
