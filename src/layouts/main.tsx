import { MainLayoutInterface } from "@/models";
import { getDesignTokens } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { createContext, useEffect, useState } from "react";

const HeaderSection = dynamic(() => import("../sections/header"));
const FooterSection = dynamic(() => import("../sections/footer"));
const SearchModal = dynamic(
  () => import("../components/searchModal/searchModal")
);
export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = createTheme(getDesignTokens(mode));

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
  return (
    <>
      <ThemeProvider theme={theme}>
        <MainLayoutContext.Provider
          value={{
            mobileMenuOpen,
            setMobileMenuOpen,
            searchOpen,
            setSearchOpen,
            mode,
            setMode,
          }}
        >
          <SearchModal />
          <Stack
            minHeight={"100vh"}
            sx={{
              backgroundColor: "myBackground.default",
              transition: "all .2s linear",
            }}
          >
            <HeaderSection />
            <Box flexGrow={1}>{children}</Box>
            <FooterSection />
          </Stack>
        </MainLayoutContext.Provider>
      </ThemeProvider>
    </>
  );
};
