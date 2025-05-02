import axios from 'axios';
import { getToken } from '@clerk/clerk-react';

export const api = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:5000/api',
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
