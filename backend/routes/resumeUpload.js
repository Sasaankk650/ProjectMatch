const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const { encryptResponse } = require('../utils/encryption');

// ✅ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resumes';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// ✅ Upload resumes route
router.post('/upload-resume', upload.array('resumes'), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json(encryptResponse({ error: 'No files uploaded' }));
    }

    const stored = await Resume.insertMany(
      files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
      }))
    );

    res.status(201).json(encryptResponse({ message: 'Resumes uploaded successfully', stored }));
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json(encryptResponse({ error: 'Upload failed' }));
  }
});

// ✅ Get all resumes (needed by resume list page)
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.json(encryptResponse(resumes));
  } catch (err) {
    console.error('Fetch resumes error:', err);
    res.status(500).json(encryptResponse({ error: 'Failed to fetch resumes' }));
  }
});

// ✅ Delete resume by ID
router.delete('/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json(encryptResponse({ msg: 'Resume not found' }));
    }

    // Optionally delete file from disk
    if (resume.path && fs.existsSync(resume.path)) {
      fs.unlinkSync(resume.path);
    }

    res.json(encryptResponse({ msg: 'Resume deleted successfully' }));
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json(encryptResponse({ msg: 'Failed to delete resume' }));
  }
});

module.exports = router;
