require('dotenv').config(); // ✅ Load env vars ONCE at the very top

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Security Middleware ───────────────────────────────────────────────────────
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ── Serve Static Frontend Files ───────────────────────────────────────────────
// ✅ Added so index.html / login.html / script.js / style.css are served properly
app.use(express.static(path.join(__dirname, 'docs')));

// ── API Routes ────────────────────────────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const ingredientRoutes = require('./routes/Ingredients');
const recipeRoutes     = require('./routes/recipes');
const aiRoutes         = require('./routes/ai');

app.use('/api/auth',        authRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes',     recipeRoutes);
app.use('/api/ai',          aiRoutes);
// ── Database Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ── Error Handling ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
