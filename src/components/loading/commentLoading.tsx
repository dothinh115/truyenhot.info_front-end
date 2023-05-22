import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
type Props = {};

const LoadingAnimation = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "70px",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  animationDuration: "2s",
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: "#f6f7f8",
  backgroundImage: `linear-gradient(to right, ${theme.palette.myBackground.loadingBack} 8%, ${theme.palette.myBackground.loadingMove} 18%, ${theme.palette.myBackground.loadingBack} 33%)`,
  backgroundSize: "200%",
}));

export const CommentLoading = (props: Props) => {
  return <LoadingAnimation></LoadingAnimation>;
};
