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

export const PermissionVariables = {
  Banned: 0,
  Members: 1,
  Editors: 2,
  Moderators: 3,
  Administrators: 4,
  Founder: 5,
};
