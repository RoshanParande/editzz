const express = require('express');
const { requireAuth, issueSessionToken } = require('../middleware/auth');
const env = require('../config/env');
const { safeText } = require('../utils/text');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const username = safeText(req.body?.username, 100);
    const password = safeText(req.body?.password, 200);
    if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = issueSessionToken();
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, username: env.ADMIN_USER });
});

module.exports = router;
