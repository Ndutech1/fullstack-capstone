const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth.js');
const User = require('../Models/User.js');
const Review = require('../Models/Review.js');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust destination if needed

// Get current user's full profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

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

// Update Profile and Return Full Data
router.put('/me', auth, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

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
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
