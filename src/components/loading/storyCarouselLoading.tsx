import React from "react";
import { Box } from "@mui/material";

type Props = {};

export const IndexStoryCarouselLoading = (props: Props) => {
  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        bgcolor={"#dddddd"}
        borderRadius={"5px"}
        overflow={"hidden"}
        sx={{
          animationDuration: {
            md: "1s",
            xs: "2s",
          },
          animationFillMode: "forwards",
          animationIterationCount: "infinite",
          animationName: "story-list-loading",
          animationTimingFunction: "linear",
          background: "#f6f7f8",
          backgroundImage:
            "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
          backgroundSize: "200%",
        }}
      >
        <Box width={"100%"} height={"150px"} position={"relative"}>
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
      </Box>
    </>
  );
};
