const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../Models/Review');
const User = require('../Models/User');

// Create or update review
router.post('/', auth, async (req, res) => {
  const { movieId, movieTitle, rating, text } = req.body;

  let review = await Review.findOne({ movieId, userId: req.user.id });

  if (review) {
    review.rating = rating;
    review.text = text;
  } else {
    const user = await User.findById(req.user.id).select('username');
    if (!user) return res.status(404).json({ message: 'User not found' });

    review = new Review({
      movieId,
      movieTitle,
      userId: req.user.id,
      username: user.username,
      rating,
      text,
    });
  }

  await review.save();
  res.json(review);
});

// Get all reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
