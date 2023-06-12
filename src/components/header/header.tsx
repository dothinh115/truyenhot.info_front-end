import { MainLayoutContext } from "@/layouts/main";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { Drawer } from "./drawer";
import { useAuth } from "@/hooks/auth/useAuth";
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  position: "static",
  backgroundColor: theme.palette.myBackground.headfoot,
  height: "50px",
  paddingRight: "0!important",
}));

const HeaderDropdownMenu = dynamic(() => import("./dropdownMenu"));
const NotificationButton = dynamic(() => import("./notificationButton"));

export function Header() {
  const { setMobileMenuOpen, setMode, mode, setSearchOpen, searchOpen } =
    useContext<any>(MainLayoutContext);
  const appBarEl = useRef<HTMLDivElement>(null);
  const yOffset = useRef<number>(0);
  const scrollHandle = () => {
    setTimeout(() => {
      yOffset.current = window.pageYOffset;
    }, 200);

    if (window.pageYOffset >= 50 && appBarEl?.current) {
      if (window.pageYOffset > yOffset.current) {
        appBarEl?.current!.classList.remove("appbar-fixed");
      }
      if (window.pageYOffset < yOffset.current - 50) {
        appBarEl?.current!.classList.add("appbar-fixed");
      }
    } else {
      if (appBarEl?.current)
        appBarEl?.current!.classList.remove("appbar-fixed");
    }
  };

  const changeModeHandle = () => {
    if (window.pageYOffset >= 50) {
      if (appBarEl?.current) appBarEl?.current!.classList.add("appbar-fixed");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandle);
    return () => {
      window.removeEventListener("scroll", scrollHandle);
    };
  });

  useEffect(() => {
    if (window.pageYOffset >= 50 && appBarEl?.current) {
      if (searchOpen) appBarEl!.current!.style.visibility = "hidden";
      else appBarEl!.current!.style.visibility = "visible";
    }
  }, [searchOpen]);

  useEffect(() => {
    changeModeHandle();
  }, [mode]);

  return (
    <>
      <Drawer />
      <AppBarStyled ref={appBarEl}>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100%"}
        >
          <Container maxWidth={"md"}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                p: 0,
                width: "100%",
              }}
              justifyContent={"space-between"}
            >
              <Box
                component={Link}
                href="/"
                sx={{
                  textDecoration: "none",
                  flexGrow: 1,
                  display: "block",
                }}
                color={"myText.main"}
                fontSize={"16px"}
                title="Home"
              >
                TRUYENHOT.INFO
              </Box>

              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={"10px"}
                sx={{
                  "& svg": { color: "myText.main" },
                }}
              >
                <IconButton
                  title="Tìm kiếm"
                  size="small"
                  onClick={() => setSearchOpen(true)}
                >
                  <SearchIcon />
                </IconButton>
                <IconButton
                  size="small"
                  title="Mode"
                  sx={{
                    display: {
                      md: "inline-flex",
                      xs: "none",
                    },
                  }}
                  onClick={() => {
                    setMode(mode === "light" ? "dark" : "light");
                    const themeData = {
                      mode: mode === "light" ? "dark" : "light",
                    };
                    localStorage.setItem("theme", JSON.stringify(themeData));
                  }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <Brightness7Icon />}
                </IconButton>

                <NotificationButton />
                <HeaderDropdownMenu />

                <IconButton
                  size="small"
                  sx={{
                    display: {
                      md: "none",
                      xs: "inline-flex",
                    },
                  }}
                  title="Menu"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </AppBarStyled>
    </>
  );
}
