const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // select:false hides password by default
    dietaryPreferences: [{ type: String }], // e.g., ['Vegetarian', 'Gluten-Free']
    allergies: [{ type: String }], // e.g., ['peanuts', 'dairy']
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
