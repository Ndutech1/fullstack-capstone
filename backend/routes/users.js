const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../Models/User');
const Review = require('../Models/Review'); // don't forget to import

// Get current user's profile data
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get reviews by the user
    const reviews = await Review.find({ userId: user._id });

    res.json({
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
      favorites: user.favorites || [],
      watchlist: user.watchlist || [],
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
