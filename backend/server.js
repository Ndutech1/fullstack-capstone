const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const connectDB = require('./Config/db');
connectDB();

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//favorites routes
const favoriteRoutes = require('./routes/favorites');
app.use('/api/favorites', favoriteRoutes);

//watchlist routes
const watchlistRoutes = require('./routes/watchlist');  
app.use('/api/watchlist', watchlistRoutes);

//reviews routes
const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);