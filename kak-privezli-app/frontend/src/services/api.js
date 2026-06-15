import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add user data to requests
api.interceptors.request.use((config) => {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;
  
  if (user) {
    config.headers['User-Data'] = JSON.stringify(user);
  }
  
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;