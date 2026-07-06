import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext();

const saveToken = (token) => {
  sessionStorage.setItem("auth_token", token);
  localStorage.setItem("auth_token", token);
};

const clearToken = () => {
  sessionStorage.removeItem("auth_token");
  localStorage.removeItem("auth_token");
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return (
      sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
    );
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data?.user || response.data || null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, [token]);

  const login = async (formData) => {
    const response = await loginUser(formData);
    const receivedToken = response.data?.token || response.token;
    const loggedInUser = response.data?.user || response.user || null;

    if (!receivedToken) {
      throw new Error("Login successful but token was not found.");
    }

    saveToken(receivedToken);
    setToken(receivedToken);
    setUser(loggedInUser);

    return response;
  };

  const register = async (formData) => {
    return await registerUser(formData);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
