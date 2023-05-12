import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {};

const LoadingWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  backgroundColor: "#dddddd",
  borderRadius: "5px",
  overflow: "hidden",
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: "#f6f7f8",
  backgroundImage:
    "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
  backgroundSize: "200%",
  [theme.breakpoints.up("xs")]: {
    animationDuration: "2s",
  },
  [theme.breakpoints.up("md")]: {
    animationDuration: "1s",
  },
}));

const LoadingItem = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "auto",
  position: "absolute",
  display: "block",
  bottom: 0,
  left: 0,
  padding: "4px",
  fontSize: ".85em",
  backgroundColor: "rgba(0,0,0, .4)",
  color: theme.palette.primary.contrastText,
  textShadow: "0 0 10px primary.main",
  minHeight: "25px",
  overflow: "hidden",
}));

export const FullStoriesLoading = (props: Props) => {
  return (
    <>
      <LoadingWrapper>
        <Box width={"100%"} height={"150px"} position={"relative"}>
          <LoadingItem></LoadingItem>
        </Box>
      </LoadingWrapper>
    </>
  );
};
