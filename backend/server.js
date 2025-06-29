require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Create Express app
const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'https://frontend-liard-three-54.vercel.app',
  'http://localhost:3000',
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const connectDB = require('./Config/db');
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
const aiRoutes = require('./routes/ai');
const favoriteRoutes = require('./routes/favorites');
const watchlistRoutes = require('./routes/watchlist');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/api/ai', aiRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
