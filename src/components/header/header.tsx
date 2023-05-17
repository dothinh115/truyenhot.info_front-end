import { MainLayoutContext } from "@/layouts";
import {
  Container,
  Stack,
  Box,
  Typography,
  AppBar,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { Drawer } from "./drawer";
import { SearchBar } from "./searchBar";
import Link from "next/link";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.myBackground.headfoot,
  height: "50px",
  position: "fixed",
  width: "100%",
  top: 0,
  left: 0,
  zIndex: 50,
}));

export function Header() {
  const { mobileMenuOpen, setMobileMenuOpen, setMode, mode, setSearchOpen } =
    useContext<any>(MainLayoutContext);

  return (
    <>
      <Drawer open={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <AppBarStyled>
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
                sx={{ textDecoration: "none", flexGrow: 1, display: "block" }}
                color={"myText.main"}
                fontSize={"16px"}
              >
                TRUYENHOT.INFO
              </Box>
              <Stack
                direction={"row"}
                alignItems={"center"}
                width={"30%"}
                justifyContent={"flex-end"}
                sx={{
                  "& > button": {
                    marginLeft: "8px",
                  },
                  "& svg": { color: "myText.main" },
                }}
              >
                <IconButton
                  size="small"
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

                <IconButton
                  size="small"
                  sx={{
                    display: {
                      md: "none",
                      xs: "inline-flex",
                    },
                  }}
                  onClick={() => setSearchOpen(true)}
                >
                  <SearchIcon />
                </IconButton>
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
                <SearchBar />
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </AppBarStyled>
    </>
  );
}
