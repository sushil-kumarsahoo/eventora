import api from "../utils/axios";

export const sendBookingOtp = async () => {
  const { data } = await api.post("/bookings/send-otp");
  return data;
};

export const createBooking = async (eventId, otp) => {
  const { data } = await api.post("/bookings", { eventId, otp });
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return data;
};

export const confirmBooking = async (id, paymentStatus) => {
  const { data } = await api.put(`/bookings/${id}/confirm`, { paymentStatus });
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};