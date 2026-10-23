const fetch = require('node-fetch');

function getOAuthStatus() {
  const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  let appleConfigured = false;
  if (process.env.APPLE_CLIENT_ID) {
    if (process.env.APPLE_CLIENT_SECRET) {
      appleConfigured = true;
    } else if (process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
      appleConfigured = true;
    }
  }
  return { google: googleConfigured, apple: appleConfigured };
}

function generateAppleClientSecret() {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;

  if (!teamId || !clientId || !keyId || !privateKey) {
    throw new Error('Apple OAuth env vars missing.');
  }

  const crypto = require('crypto');

  const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: teamId,
    iat: now,
    exp: now + 15552000,
    aud: 'https://appleid.apple.com',
    sub: clientId
  })).toString('base64url');

  const data = `${header}.${payload}`;
  const privateKeyBuf = privateKey.replace(/\\n/g, '\n');

  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  const signature = sign.sign(privateKeyBuf, 'base64url');

  return `${data}.${signature}`;
}

module.exports = { getOAuthStatus, generateAppleClientSecret };
