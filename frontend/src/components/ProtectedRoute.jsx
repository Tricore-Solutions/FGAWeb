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
    // Show 403 Forbidden error page
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <div className="mb-6">
            <h1 className="text-6xl font-heading font-bold text-river-bed mb-2">403</h1>
            <h2 className="text-2xl font-heading font-bold text-river-bed mb-4">
              Forbidden
            </h2>
            <p className="text-lg text-oslo-gray mb-2">
              Access Denied
            </p>
            <p className="text-oslo-gray">
              This page requires {requiredRole} role. You don't have permission to access this resource.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-river-bed text-white rounded-lg hover:bg-gulf-stream transition-colors duration-fast font-heading font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-gulf-stream text-white rounded-lg hover:bg-river-bed transition-colors duration-fast font-heading font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated (and has required role if specified)
  return children;
};

export default ProtectedRoute;

