require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Replace this with your actual Vercel frontend domain
const allowedOrigins = [
  'https://frontend-git-main-ndutech1s-projects.vercel.app',
  'https://frontend-iai66khbs-ndutech1s-projects.vercel.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = require('./Config/db');
connectDB().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Favorites routes
const favoriteRoutes = require('./routes/favorites');
app.use('/api/favorites', favoriteRoutes);

// Watchlist routes
const watchlistRoutes = require('./routes/watchlist');
app.use('/api/watchlist', watchlistRoutes);

// Reviews routes
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
