import api from './api';

/**
 * Fetch all users (admin only)
 * @returns {Promise} Promise that resolves to the users data
 */
export const fetchUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a single user by ID (admin only)
 * @param {string|number} id - The user ID
 * @returns {Promise} Promise that resolves to the user data
 */
export const fetchUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update a user (admin only)
 * @param {string|number} id - The user ID
 * @param {object} userData - The user data to update
 * @returns {Promise} Promise that resolves to the updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user (admin only)
 * @param {string|number} id - The user ID
 * @returns {Promise} Promise that resolves to the deletion response
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

