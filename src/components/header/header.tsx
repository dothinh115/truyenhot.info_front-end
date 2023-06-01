import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import { styled, alpha } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef } from "react";
import { Drawer } from "./drawer";
import { MainLayoutContext } from "@/layouts/main";
import { useAuth } from "@/hooks/auth/useAuth";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  position: "static",
  backgroundColor: theme.palette.myBackground.headfoot,
  height: "50px",
  paddingRight: "0!important",
}));

const DropdownMenu = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "250px",
  right: 0,
  top: "calc(100% + 5px)",
  backgroundColor: theme.palette.myBackground.secondary,
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.4)}`,
  zIndex: 10,
  display: "none",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

const ListStyled = styled(List)(({ theme }) => ({
  padding: 0,
  "& > *": {
    padding: "8px",
    borderBottom: `1px solid ${alpha(
      theme.palette.mySecondary.boxShadow,
      0.2
    )}`,
    "& *": {
      color: theme.palette.myText.primary,
    },
  },
}));

export function Header() {
  const { setMobileMenuOpen, setMode, mode, setSearchOpen, searchOpen } =
    useContext<any>(MainLayoutContext);
  const { profile, logout } = useAuth();
  const appBarEl = useRef<HTMLDivElement>(null);
  const yOffset = useRef<number>(0);
  const menuDropDown = useRef<HTMLDivElement>(null);
  const menuDropDownButton = useRef<HTMLButtonElement>(null);
  const router = useRouter();
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
      appBarEl?.current!.classList.remove("appbar-fixed");
    }
  };

  const changeModeHandle = () => {
    if (window.pageYOffset >= 50 && appBarEl?.current) {
      appBarEl?.current!.classList.add("appbar-fixed");
    }
  };

  const dropDownMenuHandle = (event: { target: any }) => {
    if (menuDropDown?.current && menuDropDownButton?.current) {
      if (menuDropDownButton?.current?.contains(event.target)) {
        if (menuDropDown!.current.style.display === "block") {
          menuDropDown!.current.style.display = "none";
        } else {
          menuDropDown!.current.style.display = "block";
        }
      } else {
        menuDropDown!.current.style.display = "none";
      }
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

  useEffect(() => {
    window.addEventListener("click", dropDownMenuHandle);
    return () => {
      window.removeEventListener("click", dropDownMenuHandle);
    };
  }, []);
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
                <IconButton size="small" onClick={() => setSearchOpen(true)}>
                  <SearchIcon />
                </IconButton>
                <IconButton
                  size="small"
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
                <Box
                  sx={{
                    position: "relative",
                    display: {
                      md: "inline-flex",
                      xs: "none",
                    },
                  }}
                >
                  <IconButton ref={menuDropDownButton}>
                    <PersonIcon />
                  </IconButton>
                  <DropdownMenu ref={menuDropDown}>
                    <ListStyled>
                      {profile ? (
                        <>
                          <ListItem>
                            <ListItemIcon
                              sx={{ minWidth: "unset", marginRight: "8px" }}
                            >
                              <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                              sx={{
                                "&>span": {
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                              primary={profile.result.email}
                            />
                          </ListItem>
                          <ListItemButton onClick={() => logout()}>
                            <ListItemIcon
                              sx={{ minWidth: "unset", marginRight: "8px" }}
                            >
                              <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                          </ListItemButton>
                        </>
                      ) : (
                        <>
                          <ListItemButton
                            onClick={() =>
                              router.push({
                                pathname: "/login",
                                query: {
                                  backTo: router.asPath,
                                },
                              })
                            }
                          >
                            <ListItemIcon
                              sx={{ minWidth: "unset", marginRight: "8px" }}
                            >
                              <LoginIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đăng nhập" />
                          </ListItemButton>

                          <ListItemButton LinkComponent={Link} href="/register">
                            <ListItemIcon
                              sx={{ minWidth: "unset", marginRight: "8px" }}
                            >
                              <HowToRegIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đăng ký" />
                          </ListItemButton>
                        </>
                      )}
                    </ListStyled>
                  </DropdownMenu>
                </Box>

                <IconButton
                  size="small"
                  sx={{
                    display: {
                      md: "none",
                      xs: "inline-flex",
                    },
                  }}
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
