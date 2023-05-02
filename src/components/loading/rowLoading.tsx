import { Box, Stack } from "@mui/material";
import React from "react";

type Props = {};

export const RowLoading = (props: Props) => {
  return (
    <Box
      width={"100%"}
      height={"15px"}
      bgcolor={"#f6f7f8"}
      borderRadius={"10px"}
      position={"relative"}
      overflow={"hidden"}
    >
      <Box
        position={"absolute"}
        display={"block"}
        height={"100%"}
        width={"40%"}
        borderRadius={"10px"}
        top={0}
        left={0}
        sx={{
          animation: "row-loading",
          animationDuration: "1.5s",
          animationFillMode: "forwards",
          animationIterationCount: "infinite",
          background: "linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%)",
          backgroundSize: "800px",
        }}
      ></Box>
    </Box>
  );
};
