import { StoryMain, StorySidebar } from "@/components/stories";
import { StorySection } from "@/sections";
import { Container } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";

type Props = {};

const StoryDetail = (props: Props) => {
  return (
    <StorySection>
      <Container
        maxWidth={"md"}
        sx={{
          m: "auto!important",
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            m: "auto!important",
          }}
        >
          <Box width={"70%"}>
            <StoryMain />
          </Box>
          <Box width={"30%"}>
            <StorySidebar />
          </Box>
        </Stack>
      </Container>
    </StorySection>
  );
};

export default StoryDetail;
