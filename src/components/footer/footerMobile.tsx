import React from "react";
import { Box } from "@mui/material";
type Props = {};

export const FooterMobile = (props: Props) => {
  return (
    <Box
      display={{
        md: "none",
        sm: "block",
      }}
    >
      FooterMobile
    </Box>
  );
};
