import React from "react";
import { Box } from "@mui/material";
import { FooterDesktop } from "@/components/footer";

type Props = {};

export const FooterSection = (props: Props) => {
  return (
    <>
      <Box component={"footer"} mt={4}>
        <FooterDesktop />
      </Box>
    </>
  );
};
