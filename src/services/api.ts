import axios from 'axios';
import { getToken } from "@/utils/clerkToken"; // We'll add this utility below

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Clerk JWT token to every request if available
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
