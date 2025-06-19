import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/loader.css';


interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for auth initialization
 if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Redirect unauthenticated users to login, preserving the intended route
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Redirect users with insufficient role permissions to their dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/dashboard/${user.role || 'host'}`} replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;