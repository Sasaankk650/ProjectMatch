# Project Match - Resume Shortlisting Platform

**Project Match** is a secure AI-powered web application that streamlines the resume shortlisting process. It enables HR teams to upload resumes, define project requirements, and automatically match the most relevant candidates using skill-based AI matching.

## Workflow

1. **Signup/Login**  
   Users register/login with a role (`HR` or `Manager HR`).

2. **Resume Upload**  
   HR uploads multiple resumes (PDFs).

3. **Project Upload**  
   HR enters one or more project requirements with:
   - Title
   - Description
   - Required Skills
   - Experience & Duration

4. **View Projects**  
   Lists all submitted projects. Each project has a button to view shortlisted resumes.

5. **Shortlist Resumes (AI Matching)**  
   Resumes are parsed using `pdf-parse` and matched to projects using:
   - Rule-based skill matching
   - Sorted by score (match percentage)
   - Zero-score resumes are excluded

## AI & Resume Scoring Logic

- **Resume Text Extraction**:  
  Uses `pdf-parse` to read resume content.

- **Skill Matching (Rule-Based AI)**:
  - Project-required skills vs. resume words
  - Fuzzy or exact matching
  - Score = `(matched skills / total required skills) * 100`

## Security Features

### AES Encryption (via `crypto-js`)
- **Encrypted Responses** from backend to frontend for:
  - Signup/Login
  - Resume Upload
  - Project Upload
  - View Projects
  - Shortlist Table
- **Encrypted Payloads** for POST requests

## Packages Used

### Frontend
- `react`
- `react-router-dom`
- `crypto-js`

### Backend
- `express`
- `mongoose`
- `bcryptjs`
- `pdf-parse`
- `multer`
- `crypto-js`
- `dotenv`
- `cors`

## Tools

- **VS Code**
- **Node.js & npm**
- **MongoDB Atlas**
- **Postman (for API testing)**

## How to Run

### Backend Setup 
 ```bash
cd backend
npm install
npm run dev


### Frontend Setup
cd client
npm install
npm start


### Folder Structure
projectmatch/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── client/
│   ├── src/
│   ├── public/
│   └── package.json

## Author
Developed by: Kottakota Sasaank
For internal training & project match automation at HR departments.

