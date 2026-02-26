const crypto = require('crypto');
const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { safeText } = require('../utils/text');

const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const name = safeText(req.body?.name, 120);
    const email = safeText(req.body?.email, 200);
    const message = safeText(req.body?.message, 4000);

    if (!name || !email || !message) {
      res.status(400).json({ error: 'name, email and message are required' });
      return;
    }

    await ContactMessage.create({
      id: crypto.randomUUID(),
      name,
      email,
      message
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not save contact message' });
  }
});

module.exports = router;
