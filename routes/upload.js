const express = require('express');
const env = require('../config/env');
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');
const { safeText } = require('../utils/text');
const { uploadDataUrlToCloudinary, uploadToCloudinaryBuffer } = require('../utils/cloudinaryUpload');

const router = express.Router();

router.post('/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (req.file?.buffer?.length) {
      const imageUrl = await uploadToCloudinaryBuffer(req.file.buffer, req.file.originalname);
      res.status(201).json({ imageUrl });
      return;
    }

    const name = safeText(req.body?.name, 150) || 'image';
    const dataUrl = safeText(req.body?.dataUrl, env.MAX_IMAGE_BYTES * 2);
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Invalid image data' });
      return;
    }
    const buffer = Buffer.from(match[2], 'base64');
    if (!buffer.length || buffer.length > env.MAX_IMAGE_BYTES) {
      res.status(400).json({ error: 'Image too large (max 5MB)' });
      return;
    }

    const imageUrl = await uploadDataUrlToCloudinary(dataUrl, name);
    res.status(201).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Cloudinary upload failed' });
  }
});

module.exports = router;
