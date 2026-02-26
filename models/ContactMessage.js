const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 4000 }
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactSchema);

module.exports = ContactMessage;
