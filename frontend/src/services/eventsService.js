import api from './api';

/**
 * Fetch all events from the API
 * @returns {Promise} Promise that resolves to the events data
 */
export const fetchEvents = async () => {
  try {
    const response = await api.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

