import React from "react";
import { Box, Stack } from "@mui/material";
type Props = {
  open: boolean;
};

export const AdminLoading = ({ open }: Props) => {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        position: "fixed",
        backgroundColor: "primary.dark",
        color: "primary.contrastText",
        textAlign: "center",
        justifyContent: "center",
        zIndex: "100",
        opacity: open ? "1" : "0",
        visibility: open ? "visible" : "hidden",
        transition: ".5s all ease",
      }}
    >
      <Box fontSize={35}>...Loading</Box>
    </Stack>
  );
};
