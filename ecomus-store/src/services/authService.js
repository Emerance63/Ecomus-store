import API from "../api/axios";

export const registerUser = async (userData) => {
  const res = await API.post("/api/auth/users/register", userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await API.post("/api/auth/users/login", userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await API.get("/api/auth/users/me");
  return res.data;
};