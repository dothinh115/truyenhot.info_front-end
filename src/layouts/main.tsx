import { MainLoading } from "@/components/loading";
import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { createContext, useState } from "react";
import { Stack, Box } from "@mui/material";

export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [loading, setLoading] = useState<boolean>(false);

  //444 - 600 - 900 - 1200
  return (
    <>
      <MainLayoutContext.Provider value={{ loading, setLoading }}>
        <MainLoading open={loading} />
        <Stack minHeight={"100vh"}>
          <HeaderSection />
          <Box flexGrow={1}>{children}</Box>
          <FooterSection />
        </Stack>
      </MainLayoutContext.Provider>
    </>
  );
};
