import { SectionInterface } from "@/models";
import { Box } from "@mui/material";
import React from "react";

export const ChapterSection = ({ children }: SectionInterface) => {
  return (
    <Box component={"section"} mt={5}>
      {children}
    </Box>
  );
};
