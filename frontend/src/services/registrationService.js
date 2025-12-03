import api from './api';

/**
 * Register for an event
 * @param {number} eventId - The ID of the event to register for
 * @returns {Promise} Promise that resolves to the registration response
 */
export const registerForEvent = async (eventId) => {
  try {
    const response = await api.post('/api/registrations/event', {
      event_id: eventId
    });
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

/**
 * Register for a program
 * @param {number} programId - The ID of the program to register for
 * @returns {Promise} Promise that resolves to the registration response
 */
export const registerForProgram = async (programId) => {
  try {
    const response = await api.post('/api/registrations/program', {
      program_id: programId
    });
    return response.data;
  } catch (error) {
    console.error('Error registering for program:', error);
    throw error;
  }
};

/**
 * Get all registrations for the logged-in user
 * @returns {Promise} Promise that resolves to the user's registrations
 */
export const getMyRegistrations = async () => {
  try {
    const response = await api.get('/api/registrations/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
};

/**
 * Fetch all registrations (admin only)
 * @returns {Promise} Promise that resolves to all registrations data
 */
export const getAllRegistrations = async () => {
  try {
    const response = await api.get('/api/registrations/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    throw error;
  }
};

