import { useAuth } from "@/hooks/auth";
import { CommentDataInterface } from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import { strip_tags, timeSince } from "@/utils/function";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  alpha,
  TextField,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Controller, useForm } from "react-hook-form";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircularProgress from "@mui/material/CircularProgress";

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
  // display: "inline-flex",
}));

const CommentRowContentInner = styled(Stack)(({ theme }) => ({
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  width: "100%",
  minWidth: "150px",
}));

const MenuDropdownWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "150px",
  backgroundColor: theme.palette.myBackground.secondary,
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.4)}`,
  right: 0,
  top: "100%",
  display: "none",
  zIndex: 50,
}));

type Props = {
  comment: CommentDataInterface;
  setSnackbar: (...args: any) => void;
  mutate: () => void;
};

export const StoryCommentRow = ({ comment, setSnackbar, mutate }: Props) => {
  const { profile } = useAuth();
  const [show, setShow] = useState<boolean>(false);
  const menuDropdownIcon = useRef<HTMLButtonElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const textAreaEl = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<{ comment_content: string }>({
    mode: "onChange",
    defaultValues: {
      comment_content: "",
    },
  });
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

  const menuDropdownClickHandle = (event: { target: any }) => {
    if (menuDropdown?.current) {
      if (menuDropdownIcon?.current?.contains(event.target)) {
        if (menuDropdown.current.style.display === "block") {
          menuDropdown.current.style.display = "none";
        } else menuDropdown.current.style.display = "block";
      } else {
        if (menuDropdown?.current) menuDropdown.current.style.display = "none";
      }
    }
  };

  const submitHandle = async (data: { comment_content: string }) => {
    const comment_content = strip_tags(
      data.comment_content,
      "b",
      "i",
      "u"
    ).replaceAll("\n", "<br/>");
    try {
      await API.put(`/comments/edit/${comment._id}`, {
        comment_content,
      });
      setSnackbar({
        message: "Sửa comment thành công!",
        open: true,
        type: "success",
      });
      mutate();
      setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener("click", menuDropdownClickHandle);
    return () => {
      window.removeEventListener("click", menuDropdownClickHandle);
    };
  }, []);

  return (
    <CommentRow>
      <CommentRowContentWrapper
        sx={{
          display: editing ? "flex" : "inline-flex",
          width: "100%",
        }}
      >
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
            {editing ? (
              <>
                <Controller
                  name={"comment_content"}
                  control={control}
                  rules={{
                    required: "Không được để trống",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      fullWidth
                      onChange={onChange}
                      ref={textAreaEl}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLDivElement>
                      ) => {
                        if (window.innerWidth > 430) {
                          if (event.key === "Enter" || event.keyCode === 13) {
                            if (!event.altKey) {
                              event.preventDefault();
                              handleSubmit(submitHandle)();
                            } else {
                              setValue("comment_content", `${value}\n`);
                            }
                          }
                        }
                      }}
                      value={value.replace(/↵/g, "\n")}
                      multiline
                      error={!!errors?.comment_content}
                      sx={{
                        my: 1,
                        backgroundColor: "myBackground.secondary",
                        "& textarea": {
                          fontSize: ".9em",
                        },
                      }}
                      size="small"
                      disabled={profile ? false : true}
                    />
                  )}
                />
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"flex-end"}
                  sx={{
                    fontSize: ".8em",
                  }}
                  gap={"5px"}
                >
                  {isSubmitting ? (
                    <CircularProgress size={"2em"} />
                  ) : (
                    <>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setEditing(false)}
                      >
                        <CancelIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleSubmit(submitHandle)()}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </>
                  )}
                </Stack>
              </>
            ) : (
              <>
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
              </>
            )}
          </CommentRowContentInner>
          {(profile?.result._id === comment.author._id ||
            profile?.result.permission > PermissionVariables.Editors) &&
            !editing && (
              <Box
                sx={{
                  display: "inline-block",
                  marginLeft: "5px",
                  position: "relative",
                }}
              >
                <IconButton
                  sx={{
                    width: "40px",
                    height: "40px",
                  }}
                  ref={menuDropdownIcon}
                >
                  <MoreHorizIcon />
                </IconButton>
                <MenuDropdownWrapper ref={menuDropdown}>
                  <List
                    dense={true}
                    sx={{
                      padding: 0,
                    }}
                  >
                    <ListItemButton onClick={() => deleteHandle(comment._id)}>
                      <ListItemIcon color="error">
                        <DeleteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Xóa" />
                    </ListItemButton>

                    <ListItemButton
                      onClick={() => {
                        setEditing(true);
                        setValue(
                          "comment_content",
                          comment?.comment_content.replaceAll("<br/>", "\n")
                        );
                      }}
                    >
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sửa" />
                    </ListItemButton>
                  </List>
                </MenuDropdownWrapper>
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
