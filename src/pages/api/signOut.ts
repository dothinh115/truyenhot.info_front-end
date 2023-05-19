// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  new Promise((resolve) => {
    const cookies = new Cookies(req, res);
    cookies.set("accessToken");
    res.status(200).json({ message: "Đăng xuất thành công!" });
    resolve(true);
  });
}
