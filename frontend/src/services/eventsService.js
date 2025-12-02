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

/**
 * Fetch a single event by ID from the API
 * @param {string|number} id - The event ID
 * @returns {Promise} Promise that resolves to the event data
 */
export const fetchEventById = async (id) => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

