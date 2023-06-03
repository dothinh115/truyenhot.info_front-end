import { useState, useEffect } from "react";

export const useTheme = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const loadTheme = (): void => {
    let theme: any = localStorage.getItem("theme");
    if (theme) {
      theme = JSON.parse(theme);
      setMode(theme.mode);
    } else {
      setMode("light");
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);
  return { mode, setMode };
};
