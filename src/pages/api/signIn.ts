// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy, { ProxyResCallback } from "http-proxy";
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
  req.headers.cookie = "";
  new Promise((resolve) => {
    proxy.web(req, res, {
      target: apiURL,
      changeOrigin: true,
      selfHandleResponse: true,
    });

    const proxyResCb: ProxyResCallback = (proxyRes, req, res) => {
      let body = "";
      proxyRes.on("data", (chunk) => (body += chunk));
      proxyRes.on("end", async () => {
        try {
          const { accessToken } = JSON.parse(body).result;
          const cookies = new Cookies(req, res);
          cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
          });
          (res as NextApiResponse)
            .status(200)
            .json({ message: "Đăng nhập thành công!" });
        } catch (error: any) {
          (res as NextApiResponse)
            .status(400)
            .json({ message: "something went wrong" });
        }
      });
      resolve(true);
    };

    proxy.once("proxyRes", proxyResCb);
  });
}
