import { LoginLayoutInterface } from "@/models";
import { Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

export const LoginLayout = ({ children }: LoginLayoutInterface) => {
  return (
    <Container maxWidth="sm">
      <Stack minHeight={"100vh"}>
        <Box
          component="div"
          p={1}
          my={3}
          flexGrow={1}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {children}
        </Box>
      </Stack>
    </Container>
  );
};
