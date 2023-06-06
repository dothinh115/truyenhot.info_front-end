import axios, { AxiosInstance, AxiosResponse } from "axios";

export const apiURL =
  process.env.NODE_ENV === "production"
    ? "http://api.truyenhot.info"
    : "http://localhost:5000";

export const API: AxiosInstance = axios.create({
  baseURL: `/api`,
});

export const localAPI: AxiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
  headers: {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDYwZTM4NDM1NzA5OTNhMWE4Y2ViMzkiLCJpYXQiOjE2ODYwNjE4MjR9.nc5CwdBQEwcaYCPToAPOhaKbi59O0PWuygAJQt6l1lY",
  },
});

API.interceptors.response.use(
  (res: any) => {
    return res.data;
  },
  (error: AxiosResponse) => {
    return Promise.reject(error);
  }
);

localAPI.interceptors.response.use(
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

export const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
