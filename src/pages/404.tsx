import { useEffect } from "react";
import { useRouter } from "next/router";
import { Layout404 } from "@/layouts/404";

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, []);

  return null;
};

Custom404.Layout = Layout404;

export default Custom404;
