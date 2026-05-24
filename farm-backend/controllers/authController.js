const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken(user._id);

    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
