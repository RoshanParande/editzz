const express = require('express');
const mongoose = require('mongoose');
const env = require('../config/env');
const { safeText } = require('../utils/text');

const router = express.Router();

router.get('/health', async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const cloudinaryConfigured = Boolean(env.CLOUDINARY_URL || env.HAS_CLOUDINARY_KEYS);

  res.status(dbConnected ? 200 : 503).json({
    ok: dbConnected,
    service: 'roshan-editzz-backend',
    timestamp: new Date().toISOString(),
    checks: {
      database: {
        provider: 'mongodb',
        connected: dbConnected,
        dbName: mongoose.connection.name || env.MONGO_DB_NAME
      },
      cloudinary: {
        configured: cloudinaryConfigured,
        cloudName: safeText(env.CLOUDINARY_CLOUD_NAME, 120) || 'not-set'
      }
    }
  });
});

module.exports = router;
