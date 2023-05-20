import { useAuth } from "@/hooks/auth";
import { CommentDataInterface } from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import { timeSince } from "@/utils/function";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, IconButton, Stack, styled } from "@mui/material";
import { useState } from "react";

const CommentRow = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  position: "relative",
}));

const CommentRowContentWrapper = styled(Stack)(({ theme }) => ({
  display: "inline-flex",
}));

const CommentRowContentInner = styled(Stack)(({ theme }) => ({
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  width: "100%",
  minWidth: "150px",
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
      <CommentRowContentWrapper>
        <Stack direction={"row"} width={"100%"} alignItems={"center"}>
          <CommentRowContentInner>
            <Box
              component={"h3"}
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
            <Box textAlign={"right"}>
              {comment?.comment_content.length > 400 && !show && (
                <IconButton size="small" onClick={() => setShow(true)}>
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Box>
          </CommentRowContentInner>
          {(profile?.result._id === comment.author._id ||
            profile?.result.permission > PermissionVariables.Editors) && (
            <Box
              sx={{
                display: "inline-block",
                marginLeft: "5px",
              }}
            >
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
            </Box>
          )}
        </Stack>
        <Box
          sx={{
            color: "myText.primary",
            fontSize: ".8em",
            marginLeft: "16px",
            marginTop: "5px",
          }}
        >
          {`${timeSince(
            Math.abs(
              new Date().valueOf() - new Date(comment?.created_at).valueOf()
            )
          )} trước`}
        </Box>
      </CommentRowContentWrapper>
    </CommentRow>
  );
};
