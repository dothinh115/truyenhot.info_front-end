import React, { ReactNode } from "react";
import { Box, Container, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";

interface AdminMainInterface {
  children: ReactNode;
}

export const AdminMain = ({ children }: AdminMainInterface) => {
  return (
    <>
      <Stack
        component={"div"}
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        sx={{
          bgcolor: "#03a9f4",
        }}
      >
        <Box
          sx={{
            p: 1,
            pr: 2,
            color: "primary.contrastText",
          }}
        >
          <Avatar>F</Avatar>
        </Box>
      </Stack>
      <Box>{children}</Box>
    </>
  );
};
