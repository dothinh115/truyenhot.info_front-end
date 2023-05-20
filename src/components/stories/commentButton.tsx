import React from "react";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemIcon,
  Stack,
  alpha,
} from "@mui/material";
import { useSnackbar } from "@/hooks/snackbar";
type Props = {};

export const StoryCommentButton = (props: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();
  return (
    <>
      {snackbar}
      <Button
        color="secondary"
        startIcon={<ModeCommentIcon />}
        onClick={() =>
          setSnackbar({
            message: "Chức năng đang được phát triển",
            open: true,
            type: "info",
          })
        }
      >
        bình luận
      </Button>
    </>
  );
};
