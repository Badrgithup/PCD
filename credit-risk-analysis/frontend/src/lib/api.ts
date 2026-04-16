import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Replace with dynamic environment variable in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically securely inject Bearer JWT Token
api.interceptors.request.use(
  (config) => {
    // Zustand persists state in localStorage
    const authStateStr = typeof window !== 'undefined' ? localStorage.getItem("finscore-auth") : null;
    if (authStateStr) {
      try {
        const authState = JSON.parse(authStateStr);
        const token = authState?.state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to parse auth state", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
