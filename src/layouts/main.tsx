import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { Box, Stack } from "@mui/material";
import { createContext, useState, useRef, useEffect } from "react";
export const MainLayoutContext = createContext({});
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Link from "next/link";
export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchBarFocus, setSearchBarFocus] = useState<HTMLInputElement | null>(
    null
  );
  const navigationBar = useRef<HTMLDivElement | null>(null);
  const lastScollY = useRef<number>(0);
  const controlNavigationBar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScollY.current) {
        navigationBar.current!.style.bottom = "-100%";
        navigationBar.current!.style.transition = "0.3s";
      } else {
        navigationBar.current!.style.bottom = "0px";
        navigationBar.current!.style.transition = "0.3s";
      }
      setTimeout(() => {
        lastScollY.current = window.pageYOffset;
      }, 300);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavigationBar);
    return () => {
      window.removeEventListener("scroll", controlNavigationBar);
    };
  }, []);
  return (
    <>
      <Box
        component={BottomNavigation}
        sx={{
          width: "100%",
          display: {
            md: "none",
            xs: "flex",
          },
          position: "fixed",
          bottom: 0,
          zIndex: 100,
        }}
        showLabels
        ref={navigationBar}
      >
        <BottomNavigationAction
          label="Trang chủ"
          LinkComponent={Link}
          href={`/`}
          icon={<HomeSharpIcon />}
        />
        <BottomNavigationAction
          label="Tìm kiếm"
          onClick={() => {
            if (searchBarFocus) searchBarFocus.click();
          }}
          icon={<SearchSharpIcon />}
        />
        <BottomNavigationAction
          label="Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          icon={<MenuSharpIcon />}
        />
      </Box>
      <MainLayoutContext.Provider
        value={{
          mobileMenuOpen,
          setMobileMenuOpen,
          searchBarFocus,
          setSearchBarFocus,
        }}
      >
        <Stack minHeight={"100vh"}>
          <HeaderSection />
          <Box flexGrow={1}>{children}</Box>
          <FooterSection />
        </Stack>
      </MainLayoutContext.Provider>
    </>
  );
};
