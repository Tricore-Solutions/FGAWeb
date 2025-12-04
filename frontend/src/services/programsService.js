import api from './api';

/**
 * Fetch all programs from the API
 * @returns {Promise} Promise that resolves to the programs data
 */
export const fetchPrograms = async () => {
  try {
    const response = await api.get('/api/programs');
    return response.data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

/**
 * Fetch a single program by ID from the API
 * @param {string|number} id - The program ID
 * @returns {Promise} Promise that resolves to the program data
 */
export const fetchProgramById = async (id) => {
  try {
    const response = await api.get(`/api/programs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching program:', error);
    throw error;
  }
};

