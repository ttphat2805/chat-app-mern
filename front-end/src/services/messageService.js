import axiosInstance from "./axiosInstance";

const urlMessage = "/api/message";

const sendMessage = (data) => {
  return axiosInstance.post(`${urlMessage}`, data);
};

const fetchMessages = (id) => {
  return axiosInstance.get(`${urlMessage}/${id}`);
};

export const messageSerive = {
  sendMessage,
  fetchMessages,
};
