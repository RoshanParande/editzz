const crypto = require('crypto');
const env = require('../config/env');

const sessions = new Map();

function tokenFromRequest(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice(7).trim();
}

function issueSessionToken() {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now() + env.TOKEN_TTL_MS);
  return token;
}

function requireAuth(req, res, next) {
  const token = tokenFromRequest(req);
  const expiresAt = sessions.get(token);
  if (!token || !expiresAt) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

module.exports = { requireAuth, issueSessionToken };
