const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { encryptResponse, decryptPayloadMiddleware } = require('../utils/encryption');

// ✅ POST /upload-projects - Payload Encrypted
router.post('/upload-projects', decryptPayloadMiddleware, async (req, res) => {
  try {
    const { projects } = req.body;

    if (!Array.isArray(projects)) {
      return res.status(400).json(encryptResponse({ error: 'Projects should be an array.' }));
    }

    const formatted = projects.map(p => ({
      title: p.title,
      description: p.description,
      skills: [p.skill1, p.skill2, p.skill3].filter(Boolean),
      experience: p.experience,
      duration: p.duration,
    }));

    const result = await Project.insertMany(formatted);
    res.status(201).json(encryptResponse({ message: 'Projects uploaded successfully', result }));
  } catch (error) {
    console.error('Project upload error:', error);
    res.status(500).json(encryptResponse({ error: 'Failed to upload projects' }));
  }
});

// ✅ GET /projects - Response Encrypted
router.get('/projects', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const projects = await Project.find(query).sort({ createdAt: -1 });

    res.json(encryptResponse(projects));
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json(encryptResponse({ error: 'Failed to fetch projects' }));
  }
});

// ✅ DELETE /projects/:id - Response Encrypted
router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(encryptResponse({ error: 'Missing project ID' }));
    }

    await Project.findByIdAndDelete(id);
    res.json(encryptResponse({ message: 'Project deleted successfully' }));
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json(encryptResponse({ error: 'Failed to delete project' }));
  }
});

// ✅ GET /projects/:id - Response Encrypted
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json(encryptResponse({ error: 'Project not found' }));
    
    res.status(200).json(encryptResponse(project));
  } catch (err) {
    console.error('Get single project error:', err);
    res.status(500).json(encryptResponse({ error: 'Failed to fetch project' }));
  }
});

module.exports = router;
