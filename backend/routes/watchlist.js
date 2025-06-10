const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Add to watchlist
router.post('/', authMiddleware, async (req, res) => {
  const { movie } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.watchlist.find((item) => item.id === movie.id)) {
    user.watchlist.push(movie);
    await user.save();
  }
  res.json(user.watchlist);
});

// Get watchlist
router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.watchlist);
});

// Remove from watchlist
router.delete('/:id', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.watchlist = user.watchlist.filter((m) => m.id != req.params.id);
  await user.save();
  res.json(user.watchlist);
});

module.exports = router;
