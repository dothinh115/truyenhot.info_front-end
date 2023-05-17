import { Box, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
type Props = {};

const LoadingWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    animationDuration: "2s",
  },
  [theme.breakpoints.up("md")]: {
    animationDuration: "1s",
  },
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  backgroundColor: theme.palette.myBackground.loadingBack,
  backgroundImage: `linear-gradient(to right, ${theme.palette.myBackground.loadingBack} 8%, ${theme.palette.myBackground.loadingMove} 18%, ${theme.palette.myBackground.loadingBack} 33%)`,
  backgroundSize: "200%",
  height: "100px",
  position: "relative",
  "&>div": {
    background: theme.palette.myBackground.secondary,
    position: "absolute",
  },
}));
const LoadingItem = styled(Box)(({ theme }) => ({
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  marginBottom: theme.spacing(1),
  minHeight: "88px",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

export const StoryListLoading = (props: Props) => {
  return (
    <Box m={0} p={0}>
      <LoadingItem>
        <LoadingWrapper>
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
              height: "12px",
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
        </LoadingWrapper>
      </LoadingItem>
    </Box>
  );
};
