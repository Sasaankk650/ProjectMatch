const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ✅ Serve uploaded resume files
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

// ✅ Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/resumeUpload'));
app.use('/api', require('./routes/projectUpload'));
app.use('/api', require('./routes/shortlist'));
app.use('/api', require('./routes/aiShortlist'));
app.use('/api', require('./routes/resume'));  // ✅ NEW AES-encrypted /resumes route

// ✅ Serve static files from client build
app.use(express.static(path.join(__dirname, '../client/build')));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
