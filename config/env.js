const path = require('path');

require('dotenv').config();

const ROOT_DIR = path.resolve(__dirname, '..');

const env = {
  PORT: Number(process.env.PORT || 3000),
  DIST_DIR: path.join(ROOT_DIR, 'dist'),
  MAX_IMAGE_BYTES: 5 * 1024 * 1024,
  TOKEN_TTL_MS: 1000 * 60 * 60 * 12,

  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_URI_FALLBACK: process.env.MONGO_URI_FALLBACK || '',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'roshan_editzz',

  ADMIN_USER: process.env.ADMIN_USER || 'admin',
  ADMIN_PASS: process.env.ADMIN_PASS || 'change-this-password',

  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'roshan-editzz'
};

env.HAS_CLOUDINARY_KEYS = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

module.exports = env;
