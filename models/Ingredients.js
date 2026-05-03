// models/Ingredients.js
const mongoose = require('mongoose');

// ✅ Removed stray console.log that referenced undefined `path` variable

const ingredientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: 'pieces'
  }
}, { timestamps: true });

module.exports = mongoose.model('Ingredients', ingredientSchema);