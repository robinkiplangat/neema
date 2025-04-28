import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

// Custom hook to get an axios instance that always attaches Clerk JWT
export function useClerkApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}
