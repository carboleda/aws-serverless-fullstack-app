import axios from "axios";

// 1. Create the instance with base defaults
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Loaded from .env
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
