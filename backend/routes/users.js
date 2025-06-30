const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth.js');
const User = require('../Models/User.js');
const Review = require('../Models/Review.js');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${req.user.id}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get current user's full profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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

// Update profile and return full data
router.put('/me', auth, upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : req.body.image;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
