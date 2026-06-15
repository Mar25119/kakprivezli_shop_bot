const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  languageCode: { type: String, default: 'ru' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  viewedProducts: [{ 
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    viewedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);