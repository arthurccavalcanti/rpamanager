import axios from 'axios';
import { getAccessToken } from '../utils/localStorageService';

const apiClient = axios.create({
  baseURL: 'http://localhost:7777/api',
  timeout: 10000,
  headers: {'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const language = localStorage.getItem('language') || 'pt-BR';
    config.headers['Accept-Language'] = language;
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;