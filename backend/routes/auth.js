const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { encryptResponse, decryptPayloadMiddleware } = require('../utils/encryption');

// ✅ POST /api/signup
router.post('/signup', decryptPayloadMiddleware, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json(encryptResponse({ msg: 'User already exists' }));
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    res.status(201).json(encryptResponse({ msg: 'Signup successful' }));
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json(encryptResponse({ msg: 'Internal server error' }));
  }
});

// ✅ POST /api/login
router.post('/login', decryptPayloadMiddleware, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json(encryptResponse({ error: 'Invalid email or password' }));
    }

    const payload = {
      message: 'Login successful!',
      role: user.role,
      userId: user._id,
      name: user.name,
    };

    return res.json(encryptResponse(payload));
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json(encryptResponse({ error: 'Internal Server Error' }));
  }
});

module.exports = router;
