import { useEffect, useRef } from "react";

export const useDidMount = () => {
  const mount = useRef(false);

  useEffect(() => {
    mount.current = true;
  }, []);

  return mount.current;
};
