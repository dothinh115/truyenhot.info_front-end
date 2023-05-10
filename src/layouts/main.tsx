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
import { useRouter } from "next/router";
export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchBarFocus, setSearchBarFocus] = useState<HTMLInputElement | null>(
    null
  );
  const [navigationValue, setNavitionValue] = useState<string>("home");
  const navigationBar = useRef<HTMLDivElement | null>(null);
  const lastScollY = useRef<number>(0);
  const controlNavigationBar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScollY.current && lastScollY.current > 250) {
        navigationBar.current!.style.transition = "bottom 0s";
        navigationBar.current!.style.bottom = "-100%";
      } else {
        navigationBar.current!.style.transition = "bottom 0.3s";
        navigationBar.current!.style.bottom = "0px";
      }
      setTimeout(() => {
        lastScollY.current = window.pageYOffset;
      }, 500);
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
          boxShadow: "1px 1px 10px rgba(0, 0, 0, .15)",
        }}
        showLabels
        ref={navigationBar}
        value={navigationValue}
      >
        <BottomNavigationAction
          label="Trang chủ"
          LinkComponent={Link}
          href={`/`}
          icon={<HomeSharpIcon />}
          onClick={() => {
            setMobileMenuOpen(false);
            setNavitionValue("");
          }}
          value={"home"}
        />
        <BottomNavigationAction
          label="Tìm kiếm"
          onClick={() => {
            if (searchBarFocus) searchBarFocus.click();
            setNavitionValue("");
          }}
          icon={<SearchSharpIcon />}
        />
        <BottomNavigationAction
          label="Menu"
          value={"menu"}
          onClick={() => {
            setMobileMenuOpen(true);
            setNavitionValue("menu");
          }}
          icon={<MenuSharpIcon />}
        />
      </Box>
      <MainLayoutContext.Provider
        value={{
          mobileMenuOpen,
          setMobileMenuOpen,
          searchBarFocus,
          setSearchBarFocus,
          setNavitionValue,
        }}
      >
        <Stack minHeight={"100vh"} pb={mobileMenuOpen ? "56px" : 0}>
          <HeaderSection />
          <Box flexGrow={1}>{children}</Box>
          <FooterSection />
        </Stack>
      </MainLayoutContext.Provider>
    </>
  );
};
