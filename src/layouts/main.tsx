import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { Stack, Box } from "@mui/material";

export const MainLayout = ({ children }: MainLayoutInterface) => {
  //444 - 600 - 900 - 1200
  return (
    <>
      <Stack minHeight={"100vh"}>
        <HeaderSection />
        <Box flexGrow={1}>{children}</Box>
        <FooterSection />
      </Stack>
    </>
  );
};
