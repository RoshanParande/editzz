const cloudinary = require('../config/cloudinary');
const env = require('../config/env');
const { safeText } = require('./text');

function uploadToCloudinaryBuffer(fileBuffer, originalName) {
  const safeName =
    safeText(originalName || 'image', 150)
      .replace(/\.[^.]+$/, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9_-]/g, '') || 'image';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        public_id: `${Date.now()}-${safeName}`,
        resource_type: 'image'
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result?.secure_url || result?.url || '');
      }
    );
    stream.end(fileBuffer);
  });
}

async function uploadDataUrlToCloudinary(dataUrl, name) {
  const safeName = safeText(name, 150).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '') || 'image';
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: env.CLOUDINARY_FOLDER,
    public_id: `${Date.now()}-${safeName}`,
    resource_type: 'image'
  });
  return result?.secure_url || result?.url || '';
}

module.exports = { uploadToCloudinaryBuffer, uploadDataUrlToCloudinary };
