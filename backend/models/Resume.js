const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  skills: [String]  // ✅ NEW FIELD: List of skills extracted from resume
});

module.exports = mongoose.model('Resume', resumeSchema);
