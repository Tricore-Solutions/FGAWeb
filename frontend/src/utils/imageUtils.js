/**
 * Normalize image URL to ensure it's accessible
 * @param {string} imageUrl - The image URL from the database
 * @returns {string} - Normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (starts with http:// or https://), use it as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path starting with /uploads, prepend the API URL
  if (imageUrl.startsWith('/uploads')) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${API_URL}${imageUrl}`;
  }
  
  // If it doesn't start with /, assume it's a relative path and prepend /uploads
  if (!imageUrl.startsWith('/')) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${API_URL}/uploads/${imageUrl}`;
  }
  
  // Otherwise, prepend API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${API_URL}${imageUrl}`;
};

