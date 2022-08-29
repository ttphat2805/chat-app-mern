import axios from "axios";
import Config from "../config";
import axiosInstance from "./axiosInstance";

const urlAuth = "/api/user";

const uploadImage = (data) => {
  return axios.post(
    "https://api.cloudinary.com/v1_1/djuk3wjsq/image/upload",
    data
  );
};

const signUp = (data) => {
  return axios.post(`${Config.apiUrl}${urlAuth}`, data);
};

const signIn = (data) => {
  return axios.post(`${Config.apiUrl}${urlAuth}/login`, data);
};

const search = (keyword) => {
  return axiosInstance.get(`${urlAuth}?search=${keyword}`);
};

const getUser = () => {
  return axiosInstance.get(`${urlAuth}/getUser`);
};

export const authService = {
  uploadImage,
  signUp,
  signIn,
  search,
  getUser,
};
