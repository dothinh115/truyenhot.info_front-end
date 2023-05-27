import { useEffect, useRef } from "react";

export const useDidMount = () => {
  const mount = useRef(false);

  useEffect(() => {
    if (!mount.current) mount.current = true;
    console.log(mount.current);
  });

  return mount.current;
};
