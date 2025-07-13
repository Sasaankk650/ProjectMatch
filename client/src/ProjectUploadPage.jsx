import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './ProjectUploadPage.css';

const SECRET_KEY = 'MySuperSecureKey123!';

const ProjectUploadPage = () => {
  const navigate = useNavigate();

  const [forms, setForms] = useState([
    {
      title: '',
      description: '',
      skill1: '',
      skill2: '',
      skill3: '',
      experience: '',
      duration: '',
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedForms = [...forms];
    updatedForms[index][name] = value;
    setForms(updatedForms);
  };

  const handleAddResponse = () => {
    setForms([
      ...forms,
      {
        title: '',
        description: '',
        skill1: '',
        skill2: '',
        skill3: '',
        experience: '',
        duration: '',
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Encrypt the project data
      const encryptedPayload = CryptoJS.AES.encrypt(
        JSON.stringify({ projects: forms }),
        SECRET_KEY
      ).toString();

      const response = await fetch('http://localhost:5000/api/upload-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: encryptedPayload }), // ✅ send as `data`
      });

      const encrypted = await response.json();

      // ✅ Make sure `encrypted.data` exists before decryption
      if (!encrypted.data) {
        throw new Error('Invalid encrypted response');
      }

      const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (response.ok) {
        alert(decrypted.message || 'Projects uploaded successfully!');
        setForms([
          {
            title: '',
            description: '',
            skill1: '',
            skill2: '',
            skill3: '',
            experience: '',
            duration: '',
          },
        ]);
        navigate('/view-projects');
      } else {
        alert(decrypted.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('An error occurred while submitting projects.');
    }
  };

  return (
    <div className="project-form-wrapper">
      <header className="navbar">
        <div className="menu-icon">☰</div>
        <div className="brand">Project Match</div>
        <div className="profile-icon">👤</div>
      </header>

      <div className="project-form-wrapper">
        <h2>Project details form</h2>
        <form onSubmit={handleSubmit}>
          {forms.map((form, index) => (
            <div className="project-form-card" key={index}>
              <h3>Project {index + 1}</h3>

              <label>Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleChange(index, e)}
                required
              />

              <label>Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={(e) => handleChange(index, e)}
                required
              />

              <label>Required skills</label>
              <div className="skills-row">
                <input
                  type="text"
                  name="skill1"
                  placeholder="1."
                  value={form.skill1}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="skill2"
                  placeholder="2."
                  value={form.skill2}
                  onChange={(e) => handleChange(index, e)}
                />
                <input
                  type="text"
                  name="skill3"
                  placeholder="3."
                  value={form.skill3}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              <label>Experience</label>
              <input
                type="text"
                name="experience"
                placeholder="e.g. 1 year"
                value={form.experience}
                onChange={(e) => handleChange(index, e)}
                required
              />

              <label>Duration</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 3 months"
                value={form.duration}
                onChange={(e) => handleChange(index, e)}
                required
              />
            </div>
          ))}

          <button type="button" className="generate-btn" onClick={handleAddResponse}>
            Add another response
          </button>

          <button type="submit" className="submit-btn">
            Submit All Projects
          </button>

          <button
            type="button"
            className="generate-btn"
            onClick={() => navigate('/view-projects')}
          >
            View Projects
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectUploadPage;
