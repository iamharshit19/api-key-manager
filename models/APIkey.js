const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  user: { type: String, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'], required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  revokedAt: { type: Date, default: null },
  role: { type: String, default: 'user', enum: ['user', 'admin'] }
});

module.exports = mongoose.model('APIKey', apiKeySchema);
