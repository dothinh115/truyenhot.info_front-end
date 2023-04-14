// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy, { ProxyResCallback } from "http-proxy";
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
    proxy.web(req, res, {
      target: "http://localhost:5000",
      changeOrigin: true,
      selfHandleResponse: true,
    });

    const proxyResCb: ProxyResCallback = (proxyRes, req, res) => {
      let body = "";
      proxyRes.on("data", (chunk) => (body += chunk));
      proxyRes.on("end", async () => {
        try {
          const { accessToken } = JSON.parse(body).result;
          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== "development", // === false
          });
          cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
          });
          (res as NextApiResponse)
            .status(200)
            .json({ message: "Đăng nhập thành công!" });
        } catch (error) {
          (res as NextApiResponse)
            .status(400)
            .json({ message: "Something went wrong!" });
        }
      });
      resolve(true);
    };

    proxy.once("proxyRes", proxyResCb);
  });
}
