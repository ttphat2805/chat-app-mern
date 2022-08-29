import axiosInstance from "./axiosInstance";

const urlChat = "/api/chat";

const accessChat = (userId) => {
  return axiosInstance.post(`${urlChat}`, userId);
};

const fetchChats = () => {
  return axiosInstance.get(`${urlChat}`);
};

const createGroupChat = (data) => {
  return axiosInstance.post(`${urlChat}/group`, data);
};

const renameGroupChat = (data) => {
  return axiosInstance.put(`${urlChat}/groupRename`, data);
};

const addUSerToGroup = (data) => {
  return axiosInstance.put(`${urlChat}/groupAdd`, data);
};

const removeUSerToGroup = (data) => {
  return axiosInstance.put(`${urlChat}/groupRemove`, data);
};

export const chatService = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUSerToGroup,
  removeUSerToGroup,
};
