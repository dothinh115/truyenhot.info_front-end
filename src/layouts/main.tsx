import { useTheme } from "@/hooks/theme/useTheme";
import { MainLayoutInterface } from "@/models";
import { getDesignTokens } from "@/utils/theme";
import { ThemeProvider } from "@emotion/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { createTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Script from "next/script";
import { createContext, useState, useEffect } from "react";

const HeaderSection = dynamic(() => import("../sections/header"));
const FooterSection = dynamic(() => import("../sections/footer"));
const SearchModal = dynamic(
  () => import("../components/searchModal/searchModal")
);

export interface MainLayoutContextInterface {
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (data: boolean) => void;
  searchOpen?: boolean;
  setSearchOpen?: (data: boolean) => void;
  mode?: "light" | "dark";
  setMode?: (data: "light" | "dark") => void;
}

export const MainLayoutContext = createContext<MainLayoutContextInterface>({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const { mode, setMode } = useTheme();
  const theme = createTheme(getDesignTokens(mode));
  const router = useRouter();
  const { query, pathname } = router;
  useEffect(() => {
    if (query.fbclid) {
      delete query.fbclid;
      router.replace({ pathname, query }, undefined, {
        shallow: true,
      });
    }
  }, [query]);
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9923804716755487`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
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
