import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:5000',
  withCredentials: true // This enables sending cookies with requests
});

export default instance;