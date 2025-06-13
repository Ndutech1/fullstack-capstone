router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  const favorites = await Favorite.find({ userId: req.user.id });
  const watchlist = await Watchlist.find({ userId: req.user.id });
  const reviews = await Review.find({ userId: req.user.id });

  res.json({ user, favorites, watchlist, reviews });
});
