require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
  origin: (origin, callback) => {
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

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./Config/db');
connectDB();

// Favorites routes
const favoriteRoutes = require('./routes/favorites');
app.use('/api/favorites', favoriteRoutes);

// Watchlist routes
const watchlistRoutes = require('./routes/watchlist');  
app.use('/api/watchlist', watchlistRoutes);

// Reviews routes
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Auth routes
app.use('/auth', require('./routes/auth'));
