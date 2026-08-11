import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-Only cookies
  headers: {
    'x-app-role': 'customer'
  }
});

export default api;
