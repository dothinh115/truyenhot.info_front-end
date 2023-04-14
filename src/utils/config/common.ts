import axios, { AxiosInstance } from "axios";

export const API: AxiosInstance = axios.create({
  baseURL: "/api",
});

API.interceptors.response.use(
  (res: any) => {
    return res.data;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);
