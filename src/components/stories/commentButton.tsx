import React, { useEffect, useState, useRef } from "react";
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
  Modal,
  styled,
  Fade,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import { API, PermissionVariables } from "@/utils/config";
import useSWRInfinite from "swr/infinite";
import { CommentDataInterface } from "@/models/stories";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@/hooks/auth";
import { useSnackbar } from "@/hooks/snackbar";
import { timeSince } from "@/utils/function";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

const ModalInner = styled(Stack)(({ theme }) => ({
  position: "fixed",
  backgroundColor: theme.palette.myBackground.default,
  zIndex: 100,
  padding: theme.spacing(1),
  overflow: "hidden",
  [theme.breakpoints.up("xs")]: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "unset",
    transform: "unset",
    minWidth: "unset",
  },
  [theme.breakpoints.up("md")]: {
    top: "50%",
    left: "50%",
    width: "40%",
    height: "80%",
    borderRadius: theme.spacing(2),
    transform: "translate(-50%, -50%)",
    minWidth: "450px",
  },
}));

const HeaddingStyled = styled(Box)(({ theme }) => ({
  width: "100%",
  borderBottom: `1px dashed ${alpha(theme.palette.mySecondary.boxShadow, 0.8)}`,
  top: 0,
  left: 0,
}));

const CommentRowWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  borderBottom: `1px dashed ${alpha(theme.palette.mySecondary.boxShadow, 0.8)}`,
  flexGrow: 1,
  padding: theme.spacing(2, 1),
  margin: theme.spacing(0.5, 0),
  overflow: "auto",
  "&::-webkit-scrollbar": {
    borderRadius: "0 16px 16px 0",
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
}));

const CommentRow = styled(Stack)(({ theme }) => ({
  //   backgroundColor: theme.palette.myBackground.secondary,
  //   borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  position: "relative",
}));

type Props = {
  story_code: string;
};

export const StoryCommentButton = ({ story_code }: Props) => {
  const { profile } = useAuth();
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (pageIndex === 0) pageIndex = 1;
    return `/comments/getCommentsByStoryCode/${story_code}?page=${pageIndex}`;
  };
  const { data, size, setSize, mutate, isValidating } = useSWRInfinite(getKey, {
    revalidateOnMount: false,
  });
  const { snackbar, setSnackbar } = useSnackbar();
  const [open, setOpen] = useState<boolean>(false);
  const commentWrapper = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ comment_content: string }>({
    mode: "onChange",
    defaultValues: {
      comment_content: "",
    },
  });
  const closeHandle = () => setOpen(!open);
  const router = useRouter();

  const submitHandle = async (data: { comment_content: string }) => {
    try {
      await API.post(`/comments/new/${story_code}`, {
        comment_content: data.comment_content,
      });
      reset({
        comment_content: "",
      });
      mutate();
      if (commentWrapper?.current) {
        commentWrapper?.current.scroll({
          top: 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (story_code && open) mutate();
  }, [open]);
  return (
    <>
      {snackbar}
      <Modal open={open} onClose={closeHandle}>
        <Fade in={open} unmountOnExit>
          <ModalInner>
            <HeaddingStyled>
              <Box
                component={"h2"}
                sx={{
                  margin: 0,
                  color: "myText.primary",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                }}
              >
                Bình luận
                <IconButton onClick={closeHandle}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </HeaddingStyled>

            <CommentRowWrapper ref={commentWrapper}>
              {data?.map((group: any) => {
                return group?.result.map((comment: CommentDataInterface) => {
                  return (
                    <CommentRow key={comment._id}>
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
                          {comment?.comment_content}
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
                              new Date().valueOf() -
                                new Date(comment?.created_at).valueOf()
                            )
                          )} trước`}
                          {(profile?.result._id === comment.author._id ||
                            profile?.result.permission >
                              PermissionVariables.Editors) && (
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
                });
              })}
              {data && size < data[0]?.pagination.pages ? (
                <Box textAlign={"center"} sx={{ color: "myText.primary" }}>
                  <Button
                    size="small"
                    onClick={() => setSize(size + 1)}
                    disabled={isValidating ? true : false}
                    startIcon={
                      isValidating ? (
                        <CircularProgress color="inherit" size={"1em"} />
                      ) : null
                    }
                  >
                    Tải thêm bình luận cũ
                  </Button>
                </Box>
              ) : !data || data[0].result.length === 0 ? (
                <Box textAlign={"center"} sx={{ color: "myText.primary" }}>
                  Chưa có bình luận nào
                </Box>
              ) : (
                <>
                  <Box textAlign={"center"} sx={{ color: "myText.primary" }}>
                    Bạn đã xem hết bình luận
                  </Box>
                </>
              )}
            </CommentRowWrapper>

            <Box
              component={"form"}
              onSubmit={handleSubmit(submitHandle)}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
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
                    value={value}
                    placeholder={
                      profile
                        ? "Viết bình luận..."
                        : "Bạn cần đăng nhập để bình luận"
                    }
                    error={!!errors?.comment_content}
                    sx={{ my: 1, backgroundColor: "myBackground.secondary" }}
                    size="small"
                    disabled={profile ? false : true}
                    onClick={() => {
                      if (!profile)
                        router.push(`/login?backTo=${window.location.href}`);
                    }}
                  />
                )}
              />
              {profile && (
                <IconButton
                  type="submit"
                  size="large"
                  sx={{
                    height: "40px",
                    width: "40px",
                  }}
                >
                  <SendIcon />
                </IconButton>
              )}
            </Box>
          </ModalInner>
        </Fade>
      </Modal>

      <Button
        color="secondary"
        startIcon={<ModeCommentIcon />}
        onClick={() => setOpen(true)}
      >
        bình luận
      </Button>
    </>
  );
};
