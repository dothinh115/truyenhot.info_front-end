import { CommentDataInterface } from "@/models/stories";
import { API } from "@/utils/config";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, memo } from "react";
import useSWRInfinite from "swr/infinite";
import { useAuth } from "@/hooks/auth/useAuth";
import { CommentLoading } from "../loading/commentLoading";

const CommentEditor = dynamic(() => import("../comment/editor/wrapperEditor"));
const MemorizedStoryCommentRow = dynamic(() => import("../comment/commentRow"));
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
    minWidth: "600px",
  },
}));

const HeaddingStyled = styled(Box)(() => ({
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
    pageIndex += 1;
    return `/comments/getCommentsByStoryCode/${story_code}?page=${pageIndex}`;
  };

  const { data, size, setSize, mutate, isValidating, isLoading } =
    useSWRInfinite(getKey);
  const [open, setOpen] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const commentWrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { commentOpen, commentId } = router.query;
  const { pathname, query } = router;
  const closeHandle = () => {
    delete query.commentOpen;
    router.replace({ pathname, query }, undefined, {
      shallow: true,
    });
  };
  const submitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
  }) => {
    if (!profile)
      router.push({
        pathname: "/login",
        query: {
          goAround: true,
        },
      });
    try {
      await API.post(`/comments/new/${story_code}`, {
        data,
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

  const commentLoadingRender = () => {
    let html: any[] = [];
    for (let i = 0; i < 20; i++) {
      html.push(<CommentLoading key={i} />);
    }
    return html;
  };

  useEffect(() => {
    if (data && size > data[data.length - 1]?.pagination.pages && size !== 1) {
      setSize(size - 1);
    }
    if (data) {
      let findIndex: number = -1;
      let group: number = 0;
      for (let index in data) {
        findIndex = data[index]?.result.findIndex(
          (comment: CommentDataInterface) => comment._id === commentId
        );
        if (findIndex !== -1) {
          group = +index;
        }
      }
      if (findIndex !== -1) {
        const index = group * 20 + findIndex;
        if (commentWrapper.current) {
          commentWrapper.current.scroll({
            top: index * 96,
            left: 0,
          });
        }
      }
    }
  }, [data]);

  useEffect(() => {
    if (story_code && open) mutate();
  }, [open]);

  useEffect(() => {
    if (commentOpen) setOpen(true);
    else setOpen(false);
  }, [commentOpen]);

  useEffect(() => {
    if (commentId && data) {
      for (let group of data) {
        const find = group?.result.find(
          (comment: CommentDataInterface) => comment._id === commentId
        );
        if (!find) setSize(size + 1);
        else break;
      }
    }
  }, [commentId]);

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
            {isLoading
              ? commentLoadingRender()
              : data?.map((group: any) => {
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
            position={"relative"}
          >
            {profile ? (
              <>
                <CommentEditor
                  cb={submitHandle}
                  clicked={submitClicked}
                  setClicked={setSubmitClicked}
                  placeholder="Viết bình luận..."
                  sendIcon={true}
                  showEmojiButton={true}
                />

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
                          goAround: true,
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
                        query: {
                          goAround: true,
                        },
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
        onClick={() =>
          router.replace(
            {
              pathname: router.asPath,
              query: {
                commentOpen: true,
              },
            },
            undefined,
            { shallow: true }
          )
        }
      >
        bình luận
      </Button>
    </>
  );
};

const MemorizedStoryCommentButton = memo(StoryCommentButton);

export default MemorizedStoryCommentButton;
