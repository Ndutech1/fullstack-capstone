const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../Models/Review');

// Create or update review
router.post('/', auth, async (req, res) => {
  const { movieId, movieTitle, rating, text } = req.body;

  let review = await Review.findOne({ movieId, userId: req.user.id });

  if (review) {
    review.rating = rating;
    review.text = text;
  } else {
    review = new Review({
      movieId,
      movieTitle,
      userId: req.user.id,
      username: req.user.username,
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