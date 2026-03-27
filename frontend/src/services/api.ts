import axios, { type InternalAxiosRequestConfig } from "axios";

// 1. Create the instance with base defaults
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Loaded from .env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers || !config.headers.Authorization) {
      config.headers["x-user-id"] = import.meta.env.VITE_DUMMY_USER_ID; // FIXME Simulate user ID for authentication
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
