import axios from 'axios';
import { getToken } from './authToken';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function registerGuest(payload) {
  return apiClient.post('/guest/register', payload);
}