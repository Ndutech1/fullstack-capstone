const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const User = require('../Models/User');
const Favorite = require('../Models/Favorite');
const Watchlist = require('../Models/Watchlist');
const Review = require('../Models/Review');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const favorites = await Favorite.find({ userId: req.user.id });
    const watchlist = await Watchlist.find({ userId: req.user.id });
    const reviews = await Review.find({ userId: req.user.id });

    res.json({ user, favorites, watchlist, reviews });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
