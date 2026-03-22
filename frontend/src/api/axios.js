// src/api/axios.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
});

export default api;
