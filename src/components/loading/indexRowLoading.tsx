import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
type Props = {};

const LoadingWrapper = styled(Box)(({ theme }) => ({
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: theme.palette.myBackground.loading,
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
  borderBottom: "1px solid #ccc",
  position: "relative",
  height: "30px",
  "&>div": {
    backgroundColor: theme.palette.myBackground.loading,
    position: "absolute",
  },
}));

export const IndexRowLoading = (props: Props) => {
  return (
    <>
      <LoadingWrapper>
        <LoadingItem>
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
        </LoadingItem>
      </LoadingWrapper>
    </>
  );
};
