import React from "react";
import { Box, Stack } from "@mui/material";
type Props = {
  style?: any;
};

export const AdminLoading = ({ style }: Props) => {
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
        ...(style && { ...style }),
      }}
    >
      <Box fontSize={35}>...Loading</Box>
    </Stack>
  );
};
