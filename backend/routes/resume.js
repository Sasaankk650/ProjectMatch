// routes/resume.js
const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { encryptResponse } = require('../utils/encryption');

// ✅ GET /api/resumes - return all uploaded resumes with AES encryption
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(encryptResponse(resumes));
  } catch (err) {
    console.error('Failed to fetch resumes:', err);
    res.status(500).json(encryptResponse({ error: 'Failed to fetch resumes' }));
  }
});

module.exports = router;
