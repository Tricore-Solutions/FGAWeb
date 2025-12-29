import api from './api';

// Fetch all matches
export const fetchMatches = async () => {
  try {
    const response = await api.get('/matches');
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Fetch match by ID
export const fetchMatchById = async (id) => {
  try {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match:', error);
    throw error;
  }
};

