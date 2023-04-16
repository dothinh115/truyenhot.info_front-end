import axios, { AxiosInstance, AxiosResponse } from "axios";

export const API: AxiosInstance = axios.create({
  baseURL: "/api",
});

API.interceptors.response.use(
  (res: any) => {
    return res.data;
  },
  (error: AxiosResponse) => {
    return Promise.reject(error);
  }
);
