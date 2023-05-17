import { SearchModal } from "@/components/searchModal";
import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { getDesignTokens } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";

export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = createTheme(getDesignTokens(mode));
  // const colorMode = useMemo(
  //   () => ({
  //     toggleColorMode: () => {
  //       setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  //     },
  //   }),
  //   []
  // );

  const loadTheme = async () => {
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
            pb={{ md: 0, xs: 7 }}
            pt={"50px"}
            sx={{
              backgroundColor: "myBackground.default",
              maxHeight: searchOpen || mobileMenuOpen ? "100vh" : "unset",
              overflow: searchOpen || mobileMenuOpen ? "hidden" : "auto",
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
