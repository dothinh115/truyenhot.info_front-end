import { FooterComponent, HeaderComponent } from "@/components";
import { MainLayoutInterface } from "@/models";
import { Box, Container, Stack } from "@mui/material";
import React from "react";

export const MainLayout = ({ children }: MainLayoutInterface) => {
  //444 - 600 - 900 - 1200
  return (
    <>
      <Container maxWidth="md">
        <Stack minHeight="100vh">
          <HeaderComponent />
          <Box paddingY={2} flexGrow={1}>
            {children}
          </Box>
          <FooterComponent />
        </Stack>
      </Container>
    </>
  );
};
