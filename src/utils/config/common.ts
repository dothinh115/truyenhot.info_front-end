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
