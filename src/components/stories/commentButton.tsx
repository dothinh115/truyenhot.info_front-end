import { useAuth } from "@/hooks/auth";
import { useSnackbar } from "@/hooks/snackbar";
import { CommentDataInterface } from "@/models/stories";
import { API } from "@/utils/config";
import { strip_tags } from "@/utils/function";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Collapse,
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
import { TransitionGroup } from "react-transition-group";
import useSWRInfinite from "swr/infinite";
import { StoryCommentRow } from "../comment";

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
  padding: 0,
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
    getValues,
    setValue,
  } = useForm<{ comment_content: string }>({
    mode: "onChange",
    defaultValues: {
      comment_content: "",
    },
  });
  const closeHandle = () => setOpen(!open);
  const router = useRouter();

  const submitHandle = async (data: { comment_content: string }) => {
    const comment_content = strip_tags(
      data.comment_content,
      "b",
      "i",
      "u"
    ).replaceAll("\n", "<br/>");
    try {
      await API.post(`/comments/new/${story_code}`, {
        comment_content,
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
              <TransitionGroup>
                {data?.map((group: any) => {
                  return group?.result.map((comment: CommentDataInterface) => {
                    return (
                      <Collapse key={comment._id}>
                        <StoryCommentRow
                          key={comment._id}
                          comment={comment}
                          setSnackbar={setSnackbar}
                          mutate={mutate}
                        />
                      </Collapse>
                    );
                  });
                })}
              </TransitionGroup>
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
                    onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
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
                    maxRows={4}
                    multiline
                    placeholder={
                      profile
                        ? "Viết bình luận..."
                        : "Bạn cần đăng nhập để bình luận"
                    }
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
                  disabled={isSubmitting ? true : false}
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
