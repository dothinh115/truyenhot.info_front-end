import { Box } from "@mui/system";
import React from "react";

type Props = {};

export const HeaderComponent = (props: Props) => {
  return (
    <Box component="header" textAlign="center">
      <Box component="h1">Header</Box>
    </Box>
  );
};
