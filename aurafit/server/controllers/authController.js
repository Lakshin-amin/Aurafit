const jwt  = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const userPayload = (u) => ({
  id: u._id, name: u.name, email: u.email,
  fitnessLevel: u.fitnessLevel, goals: u.goals, stats: u.stats, role: u.role
});

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { name, email, password, fitnessLevel, goals, stats } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user  = await User.create({ name, email, password, fitnessLevel, goals, stats });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: userPayload(user) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user._id);
    res.json({ success: true, token, user: userPayload(user) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, fitnessLevel, goals, stats } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, { name, fitnessLevel, goals, stats }, { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
