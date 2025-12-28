import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configure axios with auth header
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Create a new subscription after successful payment
 */
export const createSubscription = async (subscriptionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/subscriptions`,
      subscriptionData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Get current user's active subscription
 */
export const getActiveSubscription = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/subscriptions/active`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching active subscription:', error);
    throw error;
  }
};

/**
 * Get all subscriptions for current user
 */
export const getMySubscriptions = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/subscriptions/my-subscriptions`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

/**
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/subscriptions/${subscriptionId}/cancel`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

export default {
  createSubscription,
  getActiveSubscription,
  getMySubscriptions,
  cancelSubscription
};

