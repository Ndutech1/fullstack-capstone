const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../Models/User');

// Add movie to favorites
router.post('/', authMiddleware, async (req, res) => {
  const { movie } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.favorites.find((fav) => fav.id === movie.id)) {
    user.favorites.push(movie);
    await user.save();
  }
  res.json(user.favorites);
});

// Get user's favorites
router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.favorites);
});

// Remove favorite
router.delete('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter((m) => m.id != req.params.id);
  await user.save();
  res.json(user.favorites);
});

module.exports = router;
