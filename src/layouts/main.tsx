import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { Stack, Box, Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, createContext } from "react";
export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <MainLayoutContext.Provider value={{ loading, setLoading }}>
        <Stack minHeight={"100vh"}>
          <HeaderSection />
          <Box flexGrow={1}>{children}</Box>
          <FooterSection />
        </Stack>
      </MainLayoutContext.Provider>
    </>
  );
};
