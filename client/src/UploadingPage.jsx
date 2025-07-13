import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UploadingPage.css';

const UploadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const files = location.state?.files || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 5 : 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100 && files.length > 0) {
      setUploadedFiles(files);
    }
  }, [progress, files]);

  const handleContinue = () => {
    navigate('/resumes');
  };

  return (
    <div className="upload-container">
      {/* ✅ Updated Green Navbar */}
      <header className="navbar">
        <div className="brand">Project Match</div>
        <div className="profile-icon">👤</div>
      </header>

      <h2 className="page-title">Upload Resumes</h2>

      <div className="upload-box">
        <div className="drop-zone uploading-preview">
          <div className="cloud-icon">☁️</div>
          <p><strong>Drag & drop files</strong> or <span className="browse-text">Browse</span></p>
          <small>Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT</small>
        </div>

        <div className="uploading-section">
          <p>Uploading - {files.length}/{files.length} files</p>

          {files.map((file, index) => (
            <div key={index} className="progress-file">
              <input type="text" readOnly value={file.originalname || file.name || 'Unknown File'} />
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="uploaded-list">
          <p>Uploaded</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="uploaded-item">
              <input type="text" readOnly value={file.originalname || file.name || 'Unknown File'} />
              <button>🗑</button>
            </div>
          ))}
        </div>

        <button className="upload-button" onClick={handleContinue}>
          View Uploaded Resumes
        </button>
      </div>
    </div>
  );
};

export default UploadingPage;
