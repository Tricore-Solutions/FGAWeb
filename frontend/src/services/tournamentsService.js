import api from './api';

/**
 * Fetch all tournaments from the API
 * @returns {Promise} Promise that resolves to the tournaments data
 */
export const fetchTournaments = async () => {
  try {
    const response = await api.get('/tournaments');
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

/**
 * Fetch a single tournament by ID from the API
 * @param {string|number} id - The tournament ID
 * @returns {Promise} Promise that resolves to the tournament data
 */
export const fetchTournamentById = async (id) => {
  try {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
};

