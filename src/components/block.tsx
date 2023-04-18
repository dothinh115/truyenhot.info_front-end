import { BlockInterface } from "@/models";
import { Box } from "@mui/system";
import React from "react";

export const Block = ({ children }: BlockInterface) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #ccc",
      }}
    >
      {children}
    </Box>
  );
};
