import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ResumeUploadPage from './ResumeUploadPage';
import UploadingPage from './UploadingPage';
import UploadedResumesPage from './UploadedResumesPage';
import ProjectUploadPage from './ProjectUploadPage';
import ViewProjectsPage from './ViewProjectsPage';
import ShortlistPage from './ShortlistPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* HR-only routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute element={<ResumeUploadPage />} allowedRoles={['hr']} />
          }
        />
        <Route
          path="/uploading"
          element={
            <ProtectedRoute element={<UploadingPage />} allowedRoles={['hr']} />
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute element={<UploadedResumesPage />} allowedRoles={['hr']} />
          }
        />
        <Route
          path="/upload-project"
          element={
            <ProtectedRoute element={<ProjectUploadPage />} allowedRoles={['hr']} />
          }
        />

        {/* Accessible to both HR and Manager HR */}
        <Route
          path="/view-projects"
          element={
            <ProtectedRoute element={<ViewProjectsPage />} allowedRoles={['hr', 'manager']} />
          }
        />
        <Route
          path="/shortlist/:projectId"
          element={
            <ProtectedRoute element={<ShortlistPage />} allowedRoles={['hr', 'manager']} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
 