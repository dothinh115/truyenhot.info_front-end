import { useEffect, useState } from "react";

export const useDidMount = () => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return mount;
};
