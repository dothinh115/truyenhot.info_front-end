import { useDidMount } from "@/hooks/useDidMount";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const Layout404 = () => {
  const didMount = useDidMount();
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  if (!didMount) return null;
};
