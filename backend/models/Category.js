const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    ru: { type: String, required: true },
    en: { type: String }
  },
  description: { type: String },
  image: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Category', categorySchema);