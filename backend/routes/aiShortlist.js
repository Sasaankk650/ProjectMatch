const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const Project = require('../models/Project');

const router = express.Router();

// Simple skill extractor (basic tokenization)
function extractSkills(text) {
  return text
    .toLowerCase()
    .match(/\b[a-zA-Z]+\b/g)
    .filter((word, index, self) => self.indexOf(word) === index);
}

// AI-based shortlisting route
router.get('/ai-shortlist/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const resumes = await Resume.find();
    const requiredSkills = project.skills.map(skill => skill.toLowerCase());

    const results = [];

    for (const resume of resumes) {
      const filePath = path.resolve(resume.path); // Absolute path

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      const text = data.text;

      // ✅ Log extracted resume text
      console.log(`--- Resume Text: ${resume.originalName} ---`);
      console.log(text);
      console.log('------------------------------------------');

      const resumeSkills = extractSkills(text);
      const matchedSkills = requiredSkills.filter(skill =>
        resumeSkills.includes(skill)
      );

      const score = (
        (matchedSkills.length / requiredSkills.length) * 100
      ).toFixed(2);

      // ✅ Include only resumes with score > 0
      if (score > 0) {
        results.push({
          resumeName: resume.originalName,
          skillsMatched: matchedSkills,
          score,
          path: `uploads/resumes/${resume.filename}`
        });
      }
    }

    res.json(results);
  } catch (err) {
    console.error('AI Shortlisting failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
