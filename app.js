const express = require('express');
const path = require('path');
const env = require('./config/env');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const healthRoutes = require('./routes/health');
const postsRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/admin', adminRoutes);
app.use('/api', contactRoutes);
app.use('/api', healthRoutes);
app.use('/api', postsRoutes);
app.use('/api', uploadRoutes);

app.use(express.static(env.DIST_DIR));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.join(env.DIST_DIR, 'index.html'));
});

module.exports = app;
