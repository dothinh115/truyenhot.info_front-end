import { useAuth } from "@/hooks/auth";
import { CommentDataInterface } from "@/models/stories";
import { API } from "@/utils/config";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  IconButton,
  Link,
  Modal,
  Stack,
  styled,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { MemorizedStoryCommentRow } from "../comment";
import dynamic from "next/dynamic";

const CommentEditor = dynamic(() => import("../comment/commentEditor"));

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
  top: 0,
  left: 0,
}));

const CommentRowWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  flexGrow: 1,
  padding: 0,
  margin: theme.spacing(2, 0),
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

const StoryCommentButton = ({ story_code }: Props) => {
  const { profile } = useAuth();

  const getKey = (pageIndex: number, previousPageData: any) => {
    return `/comments/getCommentsByStoryCode/${story_code}?page=${
      pageIndex + 1
    }`;
  };

  const { data, size, setSize, mutate, isValidating, isLoading } =
    useSWRInfinite(getKey, {
      revalidateOnMount: false,
    });
  const [open, setOpen] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const commentWrapper = useRef<HTMLDivElement>(null);

  const closeHandle = () => setOpen(!open);

  const router = useRouter();

  const submitHandle = async (data: string) => {
    if (!profile)
      router.push({
        pathname: "/login",
        query: {
          backTo: router.asPath,
        },
      });
    try {
      await API.post(`/comments/new/${story_code}`, {
        comment_content: data,
      });
      if (commentWrapper?.current) {
        commentWrapper?.current.scroll({
          top: 0,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
    }
  };

  useEffect(() => {
    if (data && size > data[data.length - 1]?.pagination.pages && size !== 1) {
      setSize(size - 1);
    }
  }, [data]);

  useEffect(() => {
    if (story_code && open) mutate();
  }, [open]);

  return (
    <>
      <Modal open={open} onClose={closeHandle}>
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
          <Box className="hr" />

          <CommentRowWrapper ref={commentWrapper}>
            {data?.map((group: any) => {
              return group?.result.map((comment: CommentDataInterface) => {
                return (
                  <MemorizedStoryCommentRow
                    key={comment._id}
                    comment={comment}
                    mutate={mutate}
                  />
                );
              });
            })}
            {data && size < data[data.length - 1]?.pagination.pages ? (
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
            ) : !data || data[0]?.result.length === 0 ? (
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
          <Box className={"hr"} />
          <Stack
            direction={"row"}
            gap={"5px"}
            alignItems={"center"}
            mt={1}
            sx={{
              color: "myText.primary",
              flexWrap: "wrap",
            }}
          >
            {profile ? (
              <>
                <CommentEditor
                  cb={submitHandle}
                  clicked={submitClicked}
                  setClicked={setSubmitClicked}
                  placeholder="Viết bình luận..."
                />

                <IconButton
                  type="submit"
                  size="large"
                  sx={{
                    height: "40px",
                    width: "40px",
                  }}
                  onClick={() => setSubmitClicked(true)}
                >
                  <SendIcon />
                </IconButton>
                <Box
                  sx={{
                    fontSize: ".8em",
                    marginLeft: "4px",
                    width: "100%",
                  }}
                >
                  Alt hoặc Shift + Enter để xuống hàng
                </Box>
              </>
            ) : (
              <Box textAlign={"center"} width={"100%"}>
                Bạn cần{" "}
                {
                  <Link
                    underline="none"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push({
                        pathname: "/login",
                        query: {
                          backTo: router.asPath,
                        },
                      })
                    }
                  >
                    đăng nhập
                  </Link>
                }{" "}
                để bình luận. Chưa có tài khoản?{" "}
                {
                  <Link
                    underline="none"
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push({
                        pathname: "/register",
                      })
                    }
                  >
                    Đăng ký
                  </Link>
                }
              </Box>
            )}
          </Stack>
        </ModalInner>
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

export default StoryCommentButton;
