const mongoose = require('mongoose');

function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: 'Database unavailable. Please try again shortly.' });
    return;
  }
  next();
}

module.exports = { requireDb };
