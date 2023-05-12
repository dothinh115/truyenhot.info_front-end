import { SearchModal } from "@/components/searchModal";
import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { Box, Stack } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Link from "next/link";
import { createContext, useState, useEffect } from "react";
export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [navigationValue, setNavitionValue] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    if (searchOpen) {
      (document.body.style.maxHeight = "100vh"),
        (document.body.style.overflow = "hidden");
    } else {
      document.body.style.maxHeight = "unset";
      document.body.style.overflow = "unset";
    }
  }, [searchOpen]);

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
          value={"search"}
          label="Tìm kiếm"
          onClick={() => {
            setSearchOpen(!searchOpen);
          }}
          icon={<SearchSharpIcon />}
        />
        <BottomNavigationAction
          label="Menu"
          value={"menu"}
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            setNavitionValue(mobileMenuOpen ? "" : "menu");
          }}
          icon={<MenuSharpIcon />}
        />
      </Box>
      <MainLayoutContext.Provider
        value={{
          mobileMenuOpen,
          setMobileMenuOpen,
          setNavitionValue,
          searchOpen,
          setSearchOpen,
        }}
      >
        <SearchModal />
        <Stack minHeight={"100vh"} pb={{ md: 0, xs: 7 }}>
          <HeaderSection />
          <Box flexGrow={1}>{children}</Box>
          <FooterSection />
        </Stack>
      </MainLayoutContext.Provider>
    </>
  );
};
