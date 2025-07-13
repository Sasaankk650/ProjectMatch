import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeUploadPage.css';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!';

const ResumeUploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('resumes', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const encrypted = await response.json();

      // 🔐 Decrypt AES response
      const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (response.ok) {
        alert(decrypted.message || "Upload successful!");
        navigate('/uploading', { state: { files: selectedFiles } });
      } else {
        alert(decrypted.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const goTo = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <div className="upload-container">
      <div className="upload-nav">
        <div className="nav-left" onClick={toggleMenu}>☰</div>
        <div className="nav-title">Project Match</div>
        <div className="nav-right">
          <div className="profile-icon">👤</div>
        </div>
        {showMenu && (
          <div className="dropdown-menu">
            <div onClick={() => goTo('/upload-project')}>Project Upload Page</div>
            <div onClick={() => goTo('/view-projects')}>View Projects Page</div>
          </div>
        )}
      </div>

      <header className="upload-header">
        <h1>Upload Resumes</h1>
      </header>

      <div className="upload-box">
        <div className="drop-zone">
          <div className="upload-icon">📄</div>
          <label className="browse-area">
            <strong>Drag & drop files</strong> or <span className="browse-text">Browse</span>
            <input type="file" multiple hidden onChange={handleFileChange} />
          </label>
          <small>Supported formats: JPEG, PNG, PDF, Word, PPT</small>
        </div>

        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
        >
          UPLOAD FILES
        </button>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
