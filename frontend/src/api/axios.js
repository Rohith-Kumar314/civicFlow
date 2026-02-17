// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://civicflow-4t7l.onrender.com/", // change in production
  // withCredentials: true, // if using cookies
});

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout if token expired
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; // redirect to home/login
    }
    return Promise.reject(error);
  }
);

export default API;
