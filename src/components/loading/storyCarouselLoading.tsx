import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const Wrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "5px",
  overflow: "hidden",
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: "#f6f7f8",
  backgroundImage: `linear-gradient(to right, ${theme.palette.background.loadingBack} 8%, ${theme.palette.background.loadingMove} 18%, ${theme.palette.background.loadingBack} 33%)`,
  backgroundSize: "200%",
  [theme.breakpoints.up("xs")]: {
    animationDuration: "2s",
  },
  [theme.breakpoints.up("md")]: {
    animationDuration: "1s",
  },
}));

type Props = {};

export const HotStoriesLoading = (props: Props) => {
  return (
    <>
      <Wrapper>
        <Box width={"100%"} height={"180px"} position={"relative"}>
          <Box
            width={"100%"}
            height={"auto"}
            position={"absolute"}
            display={"block"}
            bottom={0}
            left={0}
            p={"4px"}
            fontSize={".85em"}
            bgcolor={"rgba(0,0,0, .4)"}
            color={"primary.contrastText"}
            sx={{
              textShadow: "0 0 10px primary.main",
            }}
            minHeight={"25px"}
            overflow={"hidden"}
          ></Box>
        </Box>
      </Wrapper>
    </>
  );
};
