const { v2: cloudinary } = require('cloudinary');
const env = require('./env');

if (env.HAS_CLOUDINARY_KEYS) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  });
} else if (env.CLOUDINARY_URL) {
  cloudinary.config(env.CLOUDINARY_URL);
}

module.exports = cloudinary;
