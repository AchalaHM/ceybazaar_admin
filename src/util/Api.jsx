import axios from "axios";
import { APPURL } from "./Constants"

const Api = axios.create({
  baseURL: APPURL,
  headers: {
    // "Content-Type": "application/json",
  },
});

// Add interceptor to attach token dynamically
Api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;