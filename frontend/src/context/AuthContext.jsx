import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/authService';

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * Custom hook to use the Auth Context
 * @returns {Object} Auth context value with user, isAuthenticated, login, logout, register functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component that wraps the app and provides authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Check authentication status from localStorage
   * Updates state based on stored token and user data
   */
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setToken(token);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    checkAuth();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    // Listen for window focus (e.g., user logs in and comes back)
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  /**
   * Login function
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Promise that resolves to the login response
   */
  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);

      if (response.token) {
        // Store token and user in localStorage
        localStorage.setItem('token', response.token);
        setToken(response.token);
        
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
        } else {
          // If user data not provided, create a minimal user object
          const minimalUser = {
            id: response.id,
            email: email,
          };
          localStorage.setItem('user', JSON.stringify(minimalUser));
          setUser(minimalUser);
        }

        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error('No token received from login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Logout function
   * Clears authentication state and localStorage
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  /**
   * Register function
   * @param {Object} userData - User registration data
   * @param {string} userData.first_name - User's first name
   * @param {string} userData.last_name - User's last name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} Promise that resolves to the registration response
   */
  const register = async (userData) => {
    try {
      const response = await registerService(userData);
      // Registration doesn't automatically log the user in
      // User needs to login after registration
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check (e.g., 'admin', 'user')
   * @returns {boolean} True if user has the specified role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user is an admin
   * @returns {boolean} True if user is an admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
    register,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

