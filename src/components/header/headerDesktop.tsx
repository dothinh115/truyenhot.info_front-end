import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuIcon from "@mui/icons-material/Menu";
import { Container, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Drawer } from "./drawer";
import { SearchBar } from "./searchBar";

export function HeaderDesktop() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
      <AppBar position="static">
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
              }}
            >
              <IconButton
                LinkComponent={Link}
                href="/"
                size="large"
                edge="start"
                color="inherit"
                sx={{
                  display: {
                    xs: "inline-flex",
                    md: "none",
                  },
                }}
              >
                <AutoStoriesIcon />
              </IconButton>

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                TRUYENHOT.INFO
              </Typography>
              <SearchBar position="header" />
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                sx={{
                  display: {
                    xs: "inline-flex",
                    md: "none",
                  },
                }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Container>
        </Stack>
      </AppBar>
    </Box>
  );
}
