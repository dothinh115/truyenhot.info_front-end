// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import Cookies from "cookies";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

const proxy = httpProxy.createServer();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  req.headers.cookie = "";
  new Promise((resolve) => {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    proxy.web(req, res, {
      target: "http://localhost:5000",
      changeOrigin: true,
      selfHandleResponse: false,
    });

    proxy.once("proxyRes", () => resolve(true));
  });
}
