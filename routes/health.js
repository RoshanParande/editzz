const express = require('express');
const mongoose = require('mongoose');
const env = require('../config/env');
const cloudinary = require('../config/cloudinary');
const { safeText } = require('../utils/text');

const router = express.Router();

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms))
  ]);
}

router.get('/health', async (req, res) => {
  const runLiveChecks = safeText(req.query?.live, 10) === '1';
  const dbConnected = mongoose.connection.readyState === 1;
  const cloudinaryConfigured = Boolean(env.CLOUDINARY_URL || env.HAS_CLOUDINARY_KEYS);

  let dbLiveOk = dbConnected;
  let dbLiveError = '';
  if (runLiveChecks && dbConnected && mongoose.connection.db?.admin) {
    try {
      await withTimeout(mongoose.connection.db.admin().ping(), 4000);
      dbLiveOk = true;
    } catch (err) {
      dbLiveOk = false;
      dbLiveError = safeText(err?.message, 220);
    }
  }

  let cloudinaryLiveOk = false;
  let cloudinaryLiveError = '';
  if (runLiveChecks && cloudinaryConfigured) {
    try {
      await withTimeout(cloudinary.api.ping(), 4000);
      cloudinaryLiveOk = true;
    } catch (err) {
      cloudinaryLiveOk = false;
      cloudinaryLiveError = safeText(err?.message, 220);
    }
  }

  const overallOk = dbLiveOk && (!cloudinaryConfigured || cloudinaryLiveOk);

  res.status(overallOk ? 200 : 503).json({
    ok: overallOk,
    service: 'roshan-editzz-backend',
    timestamp: new Date().toISOString(),
    liveChecks: runLiveChecks,
    checks: {
      database: {
        provider: 'mongodb',
        connected: dbLiveOk,
        dbName: mongoose.connection.name || env.MONGO_DB_NAME,
        readyState: mongoose.connection.readyState,
        error: dbLiveError || undefined
      },
      cloudinary: {
        configured: cloudinaryConfigured,
        connected: cloudinaryConfigured ? cloudinaryLiveOk : false,
        cloudName: safeText(env.CLOUDINARY_CLOUD_NAME, 120) || 'not-set',
        error: cloudinaryLiveError || undefined
      }
    }
  });
});

module.exports = router;
