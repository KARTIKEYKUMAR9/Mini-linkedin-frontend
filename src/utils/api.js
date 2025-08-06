import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔁 change to Render URL after deployment
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;