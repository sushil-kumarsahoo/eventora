import api from "../utils/axios";

export const getEvents = async (search) => {
  const { data } = await api.get("/events", { params: { search } });
  console.log(data);
  return data;
};
