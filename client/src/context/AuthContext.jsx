import { useState } from "react";
import {
  loginRequest,
  registerRequest,
  verifyOTPRequest,
} from "../services/authService";
import { createContext } from "react";

export const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    localStorage.setItem("token", data.token);
  };

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    saveSession(data);
    return data;
  };

  const register = (name, email, password) =>
    registerRequest(name, email, password);

  const verifyOTP = async (email, otp) => {
    const data = await verifyOTPRequest(email, otp);
    saveSession(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOTP, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};