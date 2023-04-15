import { LoginLayoutInterface } from "@/models";
import { Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

export const LoginLayout = ({ children }: LoginLayoutInterface) => {
  return (
    <Container maxWidth="xs">
      <Stack minHeight={"100vh"}>
        <Stack my={3} flexGrow={1} justifyContent={"center"}>
          <Stack
            justifyContent={"center"}
            p={2}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {children}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
