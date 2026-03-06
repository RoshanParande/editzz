const express = require('express');
const path = require('path');
const cors = require('cors');
const env = require('./config/env');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const healthRoutes = require('./routes/health');
const postsRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');

const app = express();

const defaultAllowedOrigins = [
  'https://editzzz.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const lanRegex = /^https?:\/\/((192\.168|10)\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/i;
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) {
      return cb(null, true);
    }
    if (!isProduction) {
      return cb(null, true);
    }
    if (allowedOrigins.includes(origin) || localhostRegex.test(origin) || lanRegex.test(origin)) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
