import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL ,
  withCredentials: true // This enables sending cookies with requests
});

export default instance;