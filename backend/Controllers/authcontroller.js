const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (user) => ({ id: user._id, name: user.name, username: user.username, email: user.email, image: user.image || '' });
const setAuthCookie = (res, token) => res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

exports.register = async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const username = String(req.body?.username || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!name || !username || !email || !password) return res.status(400).json({ message: 'Name, username, email, and password are required.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
  if (username.length < 3) return res.status(400).json({ message: 'Username must be at least 3 characters.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Authentication is not configured.' });

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(409).json({ message: existingUser.email === email ? 'An account already exists for this email.' : 'That username is already taken.' });
    const user = await User.create({ name, username, email, password: await bcrypt.hash(password, 12) });
    const token = createToken(user);
    setAuthCookie(res, token);
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'That email or username is already in use.' });
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Unable to create your account. Please try again.' });
  }
};

exports.login = async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Authentication is not configured.' });
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    const token = createToken(user);
    setAuthCookie(res, token);
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Unable to sign in. Please try again.' });
  }
};
