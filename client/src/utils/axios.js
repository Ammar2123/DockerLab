import axios from 'axios';
import toast from 'react-hot-toast';

const instance = axios.create({
  // Use the correct environment variable - ensure this matches what you have in your .env file
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  withCredentials: true
});

// Add a request interceptor to include token in all requests
instance.interceptors.request.use(
  (config) => {
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

// Keep the response interceptor - it's useful for handling errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default instance;