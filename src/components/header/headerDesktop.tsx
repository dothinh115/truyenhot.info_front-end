import { MainLayoutContext } from "@/layouts";
import {
  Container,
  Stack,
  Box,
  Typography,
  AppBar,
  IconButton,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { Drawer } from "./drawer";
import { SearchBar } from "./searchBar";
import Link from "next/link";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function HeaderDesktop() {
  const { mobileMenuOpen, setMobileMenuOpen, setMode, mode } =
    useContext<any>(MainLayoutContext);
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.setAttribute("scroll", "no");
      document.body.style.overflow = "hidden";
    } else {
      document.body.removeAttribute("scroll");
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <Box>
      <Drawer open={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <AppBar
        position="static"
        sx={{
          backgroundColor: "myBackground.headfoot",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Container maxWidth={"md"}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              minHeight={"64px"}
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
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  TRUYENHOT.INFO
                </Typography>
              </Box>
              <Stack
                direction={"row"}
                alignItems={"center"}
                width={"30%"}
                justifyContent={"flex-end"}
              >
                <IconButton
                  onClick={() => {
                    setMode(mode === "light" ? "dark" : "light");
                    const themeData = {
                      mode: mode === "light" ? "dark" : "light",
                    };
                    localStorage.setItem("theme", JSON.stringify(themeData));
                  }}
                  sx={{ "& svg": { color: "myText.main" } }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <Brightness7Icon />}
                </IconButton>
                <SearchBar />
              </Stack>
            </Stack>
          </Container>
        </Stack>
      </AppBar>
    </Box>
  );
}
