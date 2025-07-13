const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const Project = require('../models/Project');
const { encryptResponse } = require('../utils/encryption'); // ✅ import encryption

const router = express.Router();

function extractSkills(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word, i, all) => word.length > 1 && all.indexOf(word) === i);
}

router.get('/ai-shortlist/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json(encryptResponse({ error: 'Project not found' }));
    }

    const resumes = await Resume.find();
    const shortlistResults = [];

    for (const resume of resumes) {
  const filePath = path.resolve(resume.path);
  if (!fs.existsSync(filePath)) continue;

  const pdfBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(pdfBuffer);
  const resumeSkills = extractSkills(pdfData.text);
  const requiredSkills = project.skills.map((s) => s.toLowerCase().trim());

  const matched = requiredSkills.filter((skill) => resumeSkills.includes(skill));
  const score = ((matched.length / requiredSkills.length) * 100).toFixed(2);

  // ✅ Only include resumes with score > 0
  if (score > 0) {
    shortlistResults.push({
      resumeName: resume.originalName,
      skillsMatched: matched,
      score,
      path: resume.path,
    });
  }
}

 // ✅ Sort by score descending
    shortlistResults.sort((a, b) => b.score - a.score);

    // ✅ Encrypt and send response
    res.json(encryptResponse(shortlistResults));
  } catch (err) {
    console.error('Shortlisting failed:', err);
    res.status(500).json(encryptResponse({ error: 'Internal Server Error' }));
  }
});

module.exports = router;
