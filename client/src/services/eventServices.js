import api from "../utils/axios";

export const getEvents = async (search) => {
  const { data } = await api.get("/events", { params: { search } });
  console.log(data);
  return data;
};


export const getEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const createEvent = async (eventData) => {
  const { data } = await api.post("/events", eventData);
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/events/${id}`);
  return data;
};