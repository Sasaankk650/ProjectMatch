const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  skills: [String],
  experience: String,
  duration: String,
});

module.exports = mongoose.model('Project', projectSchema);
