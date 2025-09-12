import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api', // Ensure this matches your backend URL
  withCredentials: true, // This is crucial for sending cookies (refreshToken, accessToken)
});

export const registerUser = async (formData) => {
  try {
    const response = await API.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/users/login', credentials);
    // On successful login, the backend will set httpOnly cookies.
    // The accessToken is also returned in the response body for client-side use if needed (e.g., for direct header Authorization).
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await API.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to set the Authorization header for subsequent requests
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API; // Export the configured axios instance