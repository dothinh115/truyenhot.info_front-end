import { useAuth } from "@/hooks/auth/useAuth";
import { CommentDataInterface } from "@/models/stories";
import { API } from "@/utils/config";
import CloseIcon from "@mui/icons-material/Close";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
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
  const [open, setOpen] = useState<boolean>(false);
  const getKey = (pageIndex: number, previousPageData: any) => {
    pageIndex += 1;
    return open
      ? `/comments/getCommentsByStoryCode/${story_code}?page=${pageIndex}`
      : null;
  };
  const { data, size, setSize, mutate, isValidating } = useSWRInfinite(getKey, {
    revalidateOnMount: false,
  });

  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const commentWrapper = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { commentOpen, commentId } = router.query;
  const { pathname, query } = router;

  const closeHandle = () => {
    delete query.commentOpen;
    if (query.commentId) delete query.commentId;
    if (query.subCommentId) delete query.subCommentId;
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
    for (let i = 0; i < 4; i++) {
      html.push(<CommentLoading key={i} />);
    }
    return html;
  };

  const findGroupContainsCommentId = async () => {
    if (commentId && data) {
      try {
        const checkExistingId: { result: boolean } = await API.get(
          `/comments/isCommentInStory/${story_code}?commentId=${commentId}`
        );
        if (checkExistingId.result) {
          let find = data[data.length - 1].result.find(
            (comment: CommentDataInterface) => comment._id === commentId
          );
          if (!find && size < data[data.length - 1]?.pagination.pages)
            setSize(size + 1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const calcLoadingTime = async () => {
    if (data) {
      let _count = 0;
      for (let group of data) {
        _count += group?.result.length;
      }
      let time = _count * 80;
      if (time < 1000) time = 1000;
      else if (time > 3000) time = 3000;
      setTimeout(() => {
        setLoading(false);
      }, time);
    }
  };

  const showComment = async () => {
    if (open) {
      if (!data) await mutate();
      await findGroupContainsCommentId();
      await calcLoadingTime();
    }
  };

  useEffect(() => {
    if (data && size > data[data.length - 1]?.pagination.pages && size !== 1) {
      setSize(size - 1);
    }
  }, [data]);

  useEffect(() => {
    showComment();
  }, [open, commentId, data]);

  useEffect(() => {
    if (commentOpen) setOpen(true);
    else setOpen(false);
  }, [commentOpen]);

  return (
    <>
      <Modal open={open} onClose={closeHandle}>
        <ModalInner>
          <HeaddingStyled>
            <Box
              component={"h1"}
              sx={{
                margin: 0,
                color: "myText.primary",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                fontSize: "20px",
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
            {loading
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
        onClick={() => {
          router.replace(
            {
              pathname: router.asPath,
              query: {
                commentOpen: true,
              },
            },
            undefined,
            { shallow: true }
          );
        }}
      >
        bình luận
      </Button>
    </>
  );
};

const MemorizedStoryCommentButton = memo(StoryCommentButton);

export default MemorizedStoryCommentButton;
