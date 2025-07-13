import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewProjectsPage.css';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!';

const ViewProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects?search=${searchTerm}`);
        const encrypted = await response.json();

        // ✅ Decrypt AES response
        const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        setProjects(decrypted);
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch projects');
      }
    };

    fetchProjects();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        const bytes = CryptoJS.AES.decrypt(result.data, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        alert(decrypted.message || 'Project deleted');
        setProjects(projects.filter((proj) => proj._id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting project');
    }
  };

  return (
    <div className="projects-wrapper">
      <div className="projects-topbar">
        <h2 className="projects-title">Previously Uploaded Projects</h2>
        <div className="profile-icon">👤</div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {projects.map((proj, idx) => (
        <div className="project-card" key={idx}>
          <h3 className="project-title">{proj.title}</h3>
          <p><strong>Description:</strong> {proj.description}</p>
          <p><strong>Skills:</strong> {proj.skills.join(', ')}</p>
          <p><strong>Experience:</strong> {proj.experience}</p>
          <p><strong>Duration:</strong> {proj.duration}</p>

          <div className="project-actions">
            <button className="submit-btn" onClick={() => navigate(`/shortlist/${proj._id}`)}>
              View Shortlisted Resumes
            </button>
            <button className="delete-btn" onClick={() => handleDelete(proj._id)}>
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewProjectsPage;
