import axios from "axios";
import Config from "../config";

const baseURL = Config.apiUrl;

let headers = {};

const token = localStorage.getItem("access_token");
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers,
});

export default axiosInstance;
