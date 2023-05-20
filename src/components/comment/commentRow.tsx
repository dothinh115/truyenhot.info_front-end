import { useAuth } from "@/hooks/auth";
import { useSnackbar } from "@/hooks/snackbar";
import { CommentDataInterface } from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import { strip_tags, timeSince } from "@/utils/function";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Stack,
  TextField,
  alpha,
  styled,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWRInfinite from "swr/infinite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const CommentRow = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1),
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  position: "relative",
}));
type Props = {
  comment: CommentDataInterface;
  setSnackbar: (...args: any) => void;
  mutate: () => void;
};

export const StoryCommentRow = ({ comment, setSnackbar, mutate }: Props) => {
  const { profile } = useAuth();
  const [show, setShow] = useState<boolean>(false);

  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/comments/delete/${_id}`);
      setSnackbar({
        message: "Xóa comment thành công!",
        open: true,
        type: "success",
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CommentRow>
      <Stack
        direction={"row"}
        sx={{
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            color: "myText.primary",
            display: "inline-block",
            backgroundColor: "myBackground.secondary",
            padding: "8px 16px",
            borderRadius: "16px",
            minWidth: "150px",
          }}
        >
          <Box
            component={"h4"}
            sx={{
              color: "myText.heading",
              margin: 0,
            }}
          >
            {comment?.author.user_name}
          </Box>
          <Box
            dangerouslySetInnerHTML={{
              __html:
                comment?.comment_content.length > 400 && !show
                  ? comment?.comment_content.substring(0, 400) + " ..."
                  : comment?.comment_content,
            }}
          />
          {comment?.comment_content.length > 400 && !show && (
            <Box textAlign={"right"}>
              <IconButton size="small" onClick={() => setShow(true)}>
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            color: "myText.primary",
            fontSize: ".8em",
            display: "inline-block",
            marginLeft: "5px",
          }}
        >
          {`${timeSince(
            Math.abs(
              new Date().valueOf() - new Date(comment?.created_at).valueOf()
            )
          )} trước`}
          {(profile?.result._id === comment.author._id ||
            profile?.result.permission > PermissionVariables.Editors) && (
            <IconButton
              color="error"
              sx={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => deleteHandle(comment?._id)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Stack>
    </CommentRow>
  );
};
