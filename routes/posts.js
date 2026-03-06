const crypto = require('crypto');
const express = require('express');
const Post = require('../models/Post');
const { requireAuth } = require('../middleware/auth');
const { requireDb } = require('../middleware/dbReady');
const { normalizePageKey, safeText } = require('../utils/text');
const { mapPost } = require('../utils/post');

const router = express.Router();

router.get('/posts', requireDb, async (req, res) => {
  try {
    const page = normalizePageKey(req.query?.page);
    const filter = page === 'home' ? {} : { pageKey: page };
    const rows = await Post.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ posts: rows.map(mapPost) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not fetch posts' });
  }
});

router.get('/posts/:id', requireDb, async (req, res) => {
  try {
    const id = safeText(req.params.id, 120);
    const row = await Post.findOne({ id }).lean();
    if (!row) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ post: mapPost(row) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not fetch post' });
  }
});

router.post('/posts', requireDb, requireAuth, async (req, res) => {
  try {
    const title = safeText(req.body?.title, 120);
    const description = safeText(req.body?.description, 500);
    const content = safeText(req.body?.content, 12000) || description;
    const pageKey = normalizePageKey(req.body?.pageKey);
    const buttonText = safeText(req.body?.buttonText, 60);
    const buttonLink = safeText(req.body?.buttonLink, 2000);
    const buttonIconUrl = safeText(req.body?.buttonIconUrl, 2000);
    const popupImageUrl = safeText(req.body?.popupImageUrl, 2000);

    const imageUrl = safeText(req.body?.imageUrl, 2000);

    if (!title || !description || !content || !imageUrl) {
      res.status(400).json({ error: 'title, description, content and image are required' });
      return;
    }

    const doc = await Post.create({
      id: crypto.randomUUID(),
      title,
      description,
      content,
      imageUrl,
      pageKey,
      buttonText,
      buttonLink,
      buttonIconUrl,
      popupImageUrl
    });

    res.status(201).json({ post: mapPost(doc.toObject()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not create post' });
  }
});

router.put('/posts/:id', requireDb, requireAuth, async (req, res) => {
  try {
    const id = safeText(req.params.id, 120);
    const current = await Post.findOne({ id });
    if (!current) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const title = safeText(req.body?.title, 120) || current.title;
    const description = safeText(req.body?.description, 500) || current.description;
    const content = safeText(req.body?.content, 12000) || current.content || description;
    const imageUrl = safeText(req.body?.imageUrl, 2000) || current.imageUrl;
    const pageKey = normalizePageKey(req.body?.pageKey || current.pageKey);
    const buttonText = safeText(req.body?.buttonText, 60);
    const buttonLink = safeText(req.body?.buttonLink, 2000);
    const buttonIconUrl = safeText(req.body?.buttonIconUrl, 2000);
    const popupImageUrl = safeText(req.body?.popupImageUrl, 2000);

    current.title = title;
    current.description = description;
    current.content = content;
    current.imageUrl = imageUrl;
    current.pageKey = pageKey;
    current.buttonText = buttonText;
    current.buttonLink = buttonLink;
    current.buttonIconUrl = buttonIconUrl;
    current.popupImageUrl = popupImageUrl;

    await current.save();
    res.json({ post: mapPost(current.toObject()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not update post' });
  }
});

router.delete('/posts/:id', requireDb, requireAuth, async (req, res) => {
  try {
    const id = safeText(req.params.id, 120);
    const result = await Post.deleteOne({ id });
    if (!result.deletedCount) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not delete post' });
  }
});

module.exports = router;
