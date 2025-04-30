import axios from 'axios';
import { getToken } from '../utils/clerkToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Clerk JWT token to every request if available
api.interceptors.request.use(async (config) => {
  // getToken() from @clerk/clerk-react needs to be called within a ClerkProvider context
  // It returns a promise that resolves with the token or null
  try {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting Clerk token:", error);
    // Handle the error appropriately, maybe redirect to login or show a message
  }
  return config;
});

export default api;
