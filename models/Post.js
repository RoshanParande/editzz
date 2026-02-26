const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    content: { type: String, required: true, trim: true, maxlength: 12000 },
    imageUrl: { type: String, required: true, trim: true, maxlength: 2000 },
    pageKey: { type: String, default: 'home', trim: true, maxlength: 40 },
    buttonText: { type: String, default: '', trim: true, maxlength: 60 },
    buttonLink: { type: String, default: '', trim: true, maxlength: 2000 },
    buttonIconUrl: { type: String, default: '', trim: true, maxlength: 2000 },
    popupImageUrl: { type: String, default: '', trim: true, maxlength: 2000 }
  },
  { timestamps: { createdAt: true, updatedAt: true }, versionKey: false }
);

postSchema.index({ pageKey: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

module.exports = Post;
