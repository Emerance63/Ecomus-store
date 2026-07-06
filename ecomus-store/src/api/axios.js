import axios from "axios";

const getStoredToken = () => {
  return (
    sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
  );
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
});

API.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
