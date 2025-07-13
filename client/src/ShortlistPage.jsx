import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ShortlistPage.css';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!';

const ShortlistPage = () => {
  const { projectId } = useParams();
  const [projectTitle, setProjectTitle] = useState('');
  const [shortlisted, setShortlisted] = useState([]);
  const [selectedResumePath, setSelectedResumePath] = useState(null);

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ai-shortlist/${projectId}`);
        const encrypted = await res.json();

        const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        if (Array.isArray(decrypted)) {
          setShortlisted(decrypted);
        }
      } catch (err) {
        console.error('Shortlisting error:', err);
      }
    };

    const fetchProjectTitle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`);
        const encrypted = await res.json();

        const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        setProjectTitle(decrypted.title || '');
      } catch (err) {
        console.error('Project title fetch error:', err);
      }
    };

    if (projectId) {
      fetchProjectTitle();
      fetchShortlist();
    }
  }, [projectId]);

  return (
    <div className="shortlist-container">
      <header className="shortlist-header">
        <h2>Shortlisted Resumes</h2>
        <div className="profile-icon">👤</div>
      </header>

      {projectTitle && <h3 className="project-title">Project: {projectTitle}</h3>}

      <table className="shortlist-table">
        <thead>
          <tr>
            <th>Resume</th>
            <th>Skills Matched</th>
            <th>Score (%)</th>
          </tr>
        </thead>
        <tbody>
          {shortlisted.length > 0 ? (
            shortlisted.map((item, index) => (
              <tr key={index}>
                <td>
                  <span
                    className="clickable-resume"
                    onClick={() => setSelectedResumePath(item.path)}
                  >
                    {item.resumeName}
                  </span>
                </td>
                <td>{item.skillsMatched.join(', ')}</td>
                <td>{item.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No shortlisted resumes available for this project.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedResumePath && (
        <div className="resume-modal">
          <div className="modal-content">
            <button onClick={() => setSelectedResumePath(null)}>Close</button>
            <iframe
              src={`http://localhost:5000/${selectedResumePath}`}
              width="100%"
              height="500px"
              title="Resume PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortlistPage;
