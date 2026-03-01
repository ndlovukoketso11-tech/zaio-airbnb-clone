const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * POST /api/users/login
 * Logs in a user with email and password, returns JWT and user info.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * POST /api/users/register
 * Creates a new user account. Returns JWT and user info (same as login).
 */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ message: 'Username is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const emailNorm = email.trim().toLowerCase();
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: emailNorm,
      password: hashedPassword,
      role: role === 'host' ? 'host' : 'user',
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  login,
  register,
};
