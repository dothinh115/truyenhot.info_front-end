import { Box } from "@mui/material";
type Props = {};

export const IndexRowLoading = (props: Props) => {
  return (
    <>
      <Box
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
        <Box
          borderBottom={"1px solid #ccc"}
          sx={{
            position: "relative",
            "&>div": {
              bgcolor: "#fff",
              position: "absolute",
            },
            height: "30px",
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "6px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "6px" }}></Box>
          <Box sx={{ top: 0, left: 0, bottom: 0, width: "6px" }}></Box>
          <Box sx={{ top: 0, right: 0, bottom: 0, width: "6px" }}></Box>
          <Box
            sx={{
              height: "calc(100% - 6px - 6px)",
              top: "6px",
              width: "6px",
              left: "calc(6px + 18px)",
            }}
          ></Box>
        </Box>
      </Box>
    </>
  );
};
