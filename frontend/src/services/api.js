import axios from 'axios';

// Get API URL from environment variable or use default (use `/api` to leverage Vite proxy in dev)
const rawApiUrl = import.meta.env.VITE_API_URL;
let API_URL = '/api';

// If a VITE_API_URL is provided, ensure it points to the API root.
// If the provided URL doesn't already include '/api', append it so requests like `api.get('/events')`
// will resolve to `<VITE_API_URL>/api/events` which matches the backend mount point.
if (rawApiUrl) {
  const trimmed = rawApiUrl.replace(/\/$/, '');
  API_URL = trimmed.includes('/api') ? trimmed : `${trimmed}/api`;
}

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_URL);
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies/auth credentials
});

// Request interceptor - Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
      console.error('Request URL:', error.config?.url);
      console.error('Base URL:', error.config?.baseURL);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

export default api;

