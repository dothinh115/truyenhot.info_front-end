import { Box } from "@mui/material";
import React from "react";

type Props = {};

export const HeaderMobile = (props: Props) => {
  return (
    <>
      <Box
        display={{
          md: "none",
          sm: "block",
        }}
      ></Box>
    </>
  );
};
