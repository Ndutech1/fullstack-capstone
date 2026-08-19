require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Connect to MongoDB
const connectDB = require('./Config/db');
connectDB().catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Create Express app
const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'https://frontend-liard-three-54.vercel.app',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy check failed'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly.' });
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});