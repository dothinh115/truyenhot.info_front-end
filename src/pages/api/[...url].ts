// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import Cookies from "cookies";
import { apiURL } from "@/utils/config";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

const proxy = httpProxy.createServer();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Promise((resolve) => {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    req.headers.cookie = "";

    proxy.web(req, res, {
      target: apiURL,
      changeOrigin: true,
      selfHandleResponse: false,
    });

    proxy.once("proxyRes", () => resolve(true));
  });
}
