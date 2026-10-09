import api from "../utils/axios";

export const loginRequest = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed", {cause: error});
  }
};

export const registerRequest = async (name, email, password) => {
  try {
    const { data } = await api.post("/auth/register", { name, email, password });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed", {cause: error});
  }
};

export const verifyOTPRequest = async (email, otp) => {
  try {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "OTP verification failed", {cause:error});
  }
};