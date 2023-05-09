import { MainLayoutContext } from "@/layouts";
import { Container, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import { Drawer } from "./drawer";
import { SearchBar } from "./searchBar";

export function HeaderDesktop() {
  const { mobileMenuOpen, setMobileMenuOpen } =
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
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              >
                TRUYENHOT.INFO
              </Typography>
              <SearchBar position="header" />
            </Stack>
          </Container>
        </Stack>
      </AppBar>
    </Box>
  );
}
