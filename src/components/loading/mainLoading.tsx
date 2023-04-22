import { Box, Stack } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
};

export const MainLoading = ({ open }: Props) => {
  return (
    <Stack
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: open ? "1" : "0",
        visibility: open ? "visible" : "hidden",
        transition: "1s all ease",
      }}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box className="lds-dual-ring"></Box>
    </Stack>
  );
};
