import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { Box, Stack } from "@mui/material";
import { createContext, useState } from "react";
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
