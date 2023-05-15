import { Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { styled } from "@mui/material/styles";

type Props = {};

const ListItemLoading = styled(ListItem)(({ theme }) => ({
  borderBottom: "1px dashed #ccc",
  height: "45px",
  padding: 0,
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: theme.palette.myBackground.loading,
  backgroundImage:
    "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
  backgroundSize: "200%",
  position: "relative",
  "&>div": {
    backgroundColor: theme.palette.myBackground.secondary,
    position: "absolute",
  },
  [theme.breakpoints.up("xs")]: {
    animationDuration: "2s",
  },
  [theme.breakpoints.up("md")]: {
    animationDuration: "1s",
  },
}));

export const RowLoading = (props: Props) => {
  return (
    <ListItemLoading dense={true}>
      <Box sx={{ top: 0, left: 0, right: 0, height: "8px" }}></Box>
      <Box sx={{ bottom: 0, left: 0, right: 0, height: "8px" }}></Box>
      <Box sx={{ top: 0, left: 0, bottom: 0, width: "14px" }}></Box>
      <Box sx={{ top: 0, right: 0, bottom: 0, width: "14px" }}></Box>
      <Box
        sx={{
          height: "calc(100% - 8px - 8px)",
          width: "20px",
          left: "calc(14px + 19px)",
          top: "8px",
        }}
      ></Box>
    </ListItemLoading>
  );
};
