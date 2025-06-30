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
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image || '',
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


// ✅ Profile Update Route
router.put('/me', auth, async (req, res) => {
  try {
    const { name, image } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      image: user.image || '',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
