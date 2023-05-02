import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
type Props = {};

export const StoryListLoading = (props: Props) => {
  return (
    <Box m={0} p={0}>
      <Box
        sx={{
          border: "1px dashed #ccc",
        }}
        mb={1}
        minHeight={"88px"}
      >
        <Box
          sx={{
            animationDuration: "1s",
            animationFillMode: "forwards",
            animationIterationCount: "infinite",
            animationName: "story-list-loading",
            animationTimingFunction: "linear",
            background: "#f6f7f8",
            backgroundImage:
              "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
            backgroundSize: "200%",
            height: "96px",
            position: "relative",
            "&>div": {
              background: "#fff",
              position: "absolute",
            },
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "10px" }}></Box>
          <Box sx={{ top: 0, left: 0, bottom: 0, width: "10px" }}></Box>
          <Box sx={{ top: 0, right: 0, bottom: 0, width: "10px" }}></Box>
          <Box
            sx={{
              width: "20px",
              height: "calc(100% - 20px)",
              top: "10px",
              left: "20%",
            }}
          ></Box>
          <Box
            sx={{
              height: "24px",
              top: "10px",
              left: "80%",
              width: "20%",
            }}
          ></Box>
          <Box
            sx={{
              top: "calc(10px + 24px)",
              bottom: "10px",
              left: "20%",
              height: "10px",
              width: "calc(100% - 20%)",
            }}
          ></Box>
          <Box
            sx={{
              height: "12px",
              top: "calc(10px + 24px + 10px)",
              left: "50%",
              width: "50%",
            }}
          ></Box>
          <Box
            sx={{
              height: "10px",
              top: "calc(10px + 24px + 10px + 12px)",
              left: "20%",
              width: "80%",
            }}
          ></Box>
          <Box
            sx={{
              height: "12px",
              top: "calc(10px + 24px + 10px + 12px + 10px)",
              left: "40%",
              width: "60%",
            }}
          ></Box>
          <Box
            sx={{
              height: "10px",
              top: "calc(10px + 24px + 10px + 12px + 10px + 12px)",
              left: "20%",
              width: "80%",
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
};
