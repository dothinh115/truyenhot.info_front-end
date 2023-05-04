import { Box } from "@mui/material";
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
              left: {
                md: "20%",
                xs: "30%",
              },
            }}
          ></Box>
          <Box
            sx={{
              height: "24px",
              top: "10px",
              left: "80%",
              width: "20%",
              display: {
                md: "block",
                xs: "none",
              },
            }}
          ></Box>
          <Box
            sx={{
              top: "calc(10px + 24px)",
              bottom: "10px",
              left: {
                md: "20%",
                xs: "30%",
              },
              height: "10px",
              width: {
                md: "calc(100% - 20%)",
                xs: "calc(100% - 30%)",
              },
            }}
          ></Box>
          <Box
            sx={{
              height: "12px",
              top: "calc(10px + 24px + 10px)",
              left: {
                md: "50%",
                xs: "70%",
              },
              width: {
                md: "50%",
                xs: "30%",
              },
            }}
          ></Box>
          <Box
            sx={{
              height: "10px",
              top: "calc(10px + 24px + 10px + 12px)",
              left: {
                md: "20%",
                xs: "30%",
              },
              width: {
                md: "80%",
                xs: "70%",
              },
            }}
          ></Box>
          <Box
            sx={{
              height: "12px",
              top: "calc(10px + 24px + 10px + 12px + 10px)",
              left: {
                md: "40%",
                xs: "50%",
              },
              width: {
                md: "60%",
                xs: "50%",
              },
            }}
          ></Box>
          <Box
            sx={{
              height: "10px",
              top: "calc(10px + 24px + 10px + 12px + 10px + 12px)",
              left: {
                md: "20%",
                xs: "30%",
              },
              width: {
                md: "80%",
                xs: "70%",
              },
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  );
};
