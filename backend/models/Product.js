const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    ru: { type: String, required: true },
    en: { type: String }
  },
  description: {
    ru: { type: String, required: true },
    en: { type: String }
  },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{ type: String }],
  mainImage: { type: String },
  stock: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  variants: [{
    name: { ru: String, en: String },
    price: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);