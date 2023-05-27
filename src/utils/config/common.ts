import axios, { AxiosInstance, AxiosResponse } from "axios";

export const apiURL =
  process.env.NODE_ENV === "production"
    ? "https://api1.truyenhot.info"
    : "http://localhost:5000";

export const API: AxiosInstance = axios.create({
  baseURL: `/api`,
});

export const localAPI: AxiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
  headers: {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2ODEzNzE3OTN9.W0zlJ1otqwHCX7Fzyqpz8nFFio5bbQNlHAN9XGLDs1o",
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
