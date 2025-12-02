import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component
 * Protects routes that require authentication
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string} [props.requiredRole] - Optional role requirement (e.g., 'admin')
 * @param {string} [props.redirectTo] - Optional custom redirect path (default: '/login')
 * @returns {React.ReactNode} Protected component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, loading, user, hasRole } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check for role requirement if specified
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to home or show unauthorized message
    return (
      <Navigate 
        to="/" 
        state={{ 
          error: `Access denied. This page requires ${requiredRole} role.` 
        }} 
        replace 
      />
    );
  }

  // User is authenticated (and has required role if specified)
  return children;
};

export default ProtectedRoute;

