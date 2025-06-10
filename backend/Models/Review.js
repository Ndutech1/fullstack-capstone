const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId: String,
  movieTitle: String,
  userId: String,
  username: String,
  rating: Number,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
