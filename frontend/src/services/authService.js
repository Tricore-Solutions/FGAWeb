import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.first_name - User's first name
 * @param {string} userData.last_name - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise} Promise that resolves to the registration response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} Promise that resolves to the login response
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

