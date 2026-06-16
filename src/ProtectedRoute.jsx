import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentRole } from './auth.js';

function ProtectedRoute({ allowedRole, children }) {
  const currentRole = getCurrentRole();
  const normalized = currentRole?.toLowerCase?.();

  if (!normalized || normalized !== allowedRole?.toLowerCase?.()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
