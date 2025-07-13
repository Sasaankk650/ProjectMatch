import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './UploadedResumesPage.css';

const SECRET_KEY = 'MySuperSecureKey123!'; // Same key as backend

const UploadedResumesPage = () => {
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resumes');
        const encrypted = await response.json();

        const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        setResumes(decrypted);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        alert('Failed to fetch resumes.');
      }
    };

    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        method: 'DELETE',
      });

      const encrypted = await response.json();
      const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

     if (response.ok) {
     alert(decrypted.msg);
     setResumes(resumes.filter((r) => r._id !== id));
  } else {
  alert(decrypted.msg || 'Failed to delete resume');
}
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting file');
    }
  };

  const goToProjectUpload = () => {
    navigate('/upload-project');
  };

  return (
    <div className="resumes-container">
      <header className="navbar">
        <div className="menu-icon">☰</div>
        <div className="brand">Project Match</div>
        <div className="profile-icon">👤</div>
      </header>

      <h1 className="section-title">Uploaded resumes</h1>

      <ul className="resume-list">
        {resumes
          .filter(resume => resume.originalName && resume.originalName.trim() !== '')
          .map((resume, index) => (
            <li key={resume._id} className="resume-item">
              <span className="serial-number">{index + 1}</span>
              <span className="filename">{resume.originalName}</span>
              <button className="delete-btn" onClick={() => handleDelete(resume._id)}>🗑</button>
            </li>
        ))}
      </ul>

      <div className="project-upload-button-wrapper">
        <button className="upload-project-button" onClick={goToProjectUpload}>
          Upload Project Details
        </button>
      </div>
    </div>
  );
};

export default UploadedResumesPage;
