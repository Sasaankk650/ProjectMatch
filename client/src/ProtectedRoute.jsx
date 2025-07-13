import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  // If role is missing, treat it as unauthorized
  if (!userRole || !allowedRoles.includes(userRole)) {
    alert('You do not have access to this page.');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
