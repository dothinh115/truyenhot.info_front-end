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
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { memo, useEffect, useRef, useState, createContext } from "react";
import useSWRInfinite from "swr/infinite";
import { CommentLoading } from "../loading/commentLoading";
import useSWR from "swr";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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

export const StoryCommentButtonContext = createContext({});

const StoryCommentButton = ({ story_code }: Props) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { cmtopen, cmtid, subcmtid } = router.query;
  const { pathname, query } = router;
  const getKey = (pageIndex: number, previousPageData: any) => {
    pageIndex += 1;
    return cmtopen
      ? `/comments/getCommentsByStoryCode/${story_code}?page=${pageIndex}`
      : null;
  };
  const {
    data: cmtData,
    size: cmtSize,
    setSize: cmtSetSize,
    mutate: cmtMutate,
    isValidating: cmtIsValidating,
  } = useSWRInfinite(getKey, {
    revalidateOnMount: false,
    revalidateFirstPage: false,
  });

  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const commentWrapper = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [validCmt, setValidCmt] = useState<boolean>(true);
  const { data: singleCmtData, mutate: singleCmtMutate } = useSWR(
    cmtid ? `/comments/getSingleCommentById/${cmtid}` : null,
    {
      revalidateOnMount: false,
    }
  );

  const closeHandle = (disableClose: boolean = false) => {
    setValidCmt(true);
    if (!disableClose) delete query.cmtopen;
    if (query.cmtid) delete query.cmtid;
    if (query.subcmtid) delete query.subcmtid;
    if (query.reply) delete query.reply;
    router.replace({ pathname, query }, undefined, {
      shallow: true,
    });
  };

  const submitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
    mentionData: string[];
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
      await cmtMutate();
    }
  };

  const commentLoadingRender = () => {
    let html: any[] = [];
    for (let i = 0; i < 4; i++) {
      html.push(<CommentLoading key={i} />);
    }
    return html;
  };

  const checkValidCmt = async () => {
    let result: boolean = false;
    if (cmtid) {
      try {
        const respone: { result: boolean } = await API.get(
          `/comments/checkValidComment/${story_code}?cmtid=${cmtid}${
            subcmtid ? `&subcmtid=${subcmtid}` : ""
          }`
        );
        if (respone.result) result = true;
      } catch (error) {
        console.log();
      }
    }
    return result;
  };

  const calcLoadingTime = async () => {
    if (cmtData) {
      let _count = 0;
      for (let group of cmtData) {
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

  const firstLoad = async () => {
    if (!cmtData) await cmtMutate();
  };

  const firstSingleCmtLoad = async () => {
    if (cmtid || subcmtid) {
      const valid = await checkValidCmt();
      await setValidCmt(valid);
      if (valid && cmtid) await singleCmtMutate();
    }
    await setLoading(false);
  };

  useEffect(() => {
    if (cmtopen) {
      if (cmtid || subcmtid) firstSingleCmtLoad();
      else firstLoad();
    }
  }, [cmtopen, cmtid, subcmtid]);

  useEffect(() => {
    calcLoadingTime();
  }, [cmtData]);

  const showComment =
    cmtid && singleCmtData
      ? singleCmtData.result.map((comment: CommentDataInterface) => {
          return (
            <MemorizedStoryCommentRow
              key={comment._id}
              comment={comment}
              mutate={cmtMutate}
            />
          );
        })
      : cmtData?.map((group: any) => {
          return group?.result.map((comment: CommentDataInterface) => {
            return (
              <MemorizedStoryCommentRow
                key={comment._id}
                comment={comment}
                mutate={cmtMutate}
              />
            );
          });
        });

  const showMoreButton = (
    <Box textAlign={"center"} sx={{ color: "myText.primary" }}>
      <Button
        size="small"
        onClick={() => cmtSetSize(cmtSize + 1)}
        disabled={cmtIsValidating ? true : false}
        startIcon={
          cmtIsValidating ? (
            <CircularProgress color="inherit" size={"1em"} />
          ) : null
        }
      >
        Tải thêm bình luận cũ
      </Button>
    </Box>
  );

  const editor = (
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
  );

  const invalidCmt = (
    <Stack direction={"row"} justifyContent={"center"}>
      <Typography
        sx={{
          fontSize: "20px",
          marginTop: "10px",
          color: "myText.primary",
        }}
      >
        Nội dung không hợp lệ hoặc đã bị xóa
      </Typography>
    </Stack>
  );

  return (
    <>
      <Modal open={cmtopen ? true : false} onClose={() => closeHandle()}>
        <StoryCommentButtonContext.Provider value={{ closeHandle }}>
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
                {cmtid && (
                  <IconButton onClick={() => closeHandle(true)}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                )}
                Bình luận
                <IconButton onClick={() => closeHandle()}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </HeaddingStyled>
            <Box className="hr" />
            {validCmt ? (
              <>
                <CommentRowWrapper ref={commentWrapper}>
                  {/* hiện bình luận tổng */}
                  {loading ? commentLoadingRender() : showComment}
                  {/* Hiện nút tải thêm bình luận */}
                  {!loading &&
                    !cmtid &&
                    (cmtData &&
                    cmtSize < cmtData[cmtData.length - 1]?.pagination.pages ? (
                      showMoreButton
                    ) : !cmtData || cmtData[0]?.result.length === 0 ? (
                      <Box
                        textAlign={"center"}
                        sx={{ color: "myText.primary" }}
                      >
                        Chưa có bình luận nào
                      </Box>
                    ) : (
                      <>
                        <Box
                          textAlign={"center"}
                          sx={{ color: "myText.primary" }}
                        >
                          Bạn đã xem hết bình luận
                        </Box>
                      </>
                    ))}
                </CommentRowWrapper>

                <Box className={"hr"} />
                {/* hiện comment editor */}

                {!cmtid && editor}
              </>
            ) : (
              invalidCmt
            )}
          </ModalInner>
        </StoryCommentButtonContext.Provider>
      </Modal>

      <Button
        color="secondary"
        startIcon={<ModeCommentIcon />}
        onClick={() => {
          router.replace(
            {
              pathname: router.asPath,
              query: {
                cmtopen: true,
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
