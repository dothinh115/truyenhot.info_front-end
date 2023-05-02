import { Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";

type Props = {};

export const RowLoading = (props: Props) => {
  return (
    <ListItem
      sx={{
        borderBottom: "1px dashed #ccc",
        height: "45px",
        p: 0,
        animationDuration: "1s",
        animationFillMode: "forwards",
        animationIterationCount: "infinite",
        animationName: "story-list-loading",
        animationTimingFunction: "linear",
        background: "#f6f7f8",
        backgroundImage:
          "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
        backgroundSize: "200%",
        position: "relative",
        "&>div": {
          background: "#fff",
          position: "absolute",
        },
      }}
      dense={true}
    >
      <Box sx={{ top: 0, left: 0, right: 0, height: "13px" }}></Box>
      <Box sx={{ bottom: 0, left: 0, right: 0, height: "13px" }}></Box>
      <Box sx={{ top: 0, left: 0, bottom: 0, width: "14px" }}></Box>
      <Box sx={{ top: 0, right: 0, bottom: 0, width: "14px" }}></Box>
      <Box
        sx={{
          height: "calc(100% - 13px - 13px)",
          width: "20px",
          left: "calc(14px + 19px)",
          top: "13px",
        }}
      ></Box>
    </ListItem>
  );
};
