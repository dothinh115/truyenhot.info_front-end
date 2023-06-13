import { useAuth } from "@/hooks/auth/useAuth";
import {
  CommentDataInterface,
  SubCommentDataInterface,
} from "@/models/stories";
import { API } from "@/utils/config";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import ReplyIcon from "@mui/icons-material/Reply";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import useSWRInfinite from "swr/infinite";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StoryCommentButtonContext } from "../stories/commentButton";
const CommentEditor = dynamic(() => import("./editor/wrapperEditor"));
const MemorizedStorySubCommentRow = dynamic(() => import("./subCommentRow"));
const StoryCommentContent = dynamic(() => import("./commentContent"));
const CommentMenuDropDown = dynamic(() => import("./menuDropDown"));
const CommentRowWrapper = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const CommentRow = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  position: "relative",
}));

const CommentRowContentWrapper = styled(Stack)(() => ({
  width: "100%",
}));

const CommentRowContentInner = styled(Stack)(({ theme }) => ({
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  width: "calc(100% - 45px)",
  minHeight: "80px",
  "&.markComment": {
    backgroundColor: theme.palette.myBackground.markComment,
  },
}));

const IconWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  fontSize: ".8em",
  gap: theme.spacing(0.5),
}));

const PosterSpanStyled = styled("span")(({ theme }) => ({
  color: theme.palette.myText.heading,
  margin: 0,
  fontSize: "1.1em",
  fontWeight: "bold",
  marginRight: theme.spacing(0.5),
  display: "inline-flex",
  alignItems: "center",
}));

type Props = {
  comment: CommentDataInterface;
  mutate: () => void;
};

export const StoryCommentRowContext = createContext({});

const StoryCommentRow = ({ comment, mutate }: Props) => {
  const { profile } = useAuth();
  const { replyData, setReplyData, singleCmtMutate, setSubReplyTo } =
    useContext<any>(StoryCommentButtonContext);
  const router = useRouter();
  let { pathname, query } = router;
  const { cmtid, subcmtid } = router.query;

  const getKey = (pageIndex: number) => {
    pageIndex = pageIndex + 1;
    return `/comments/sub/getSubCommentByCommentId/${comment._id}?page=${pageIndex}`;
  };

  const {
    data: subCmtData,
    size,
    setSize,
    isValidating: subCmtIsValidating,
    mutate: subCmtMutate,
  } = useSWRInfinite(getKey, {
    revalidateFirstPage: false,
  });

  const [editing, setEditing] = useState<boolean>(false);
  const commentWrapperEle = useRef<HTMLDivElement>(null);
  const commentRowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [editSubmitClicked, setEditSubmitClicked] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);

  const submitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
  }) => {
    setEditLoading(true);
    try {
      setEditing(false);
      await API.put(`/comments/edit/${comment._id}`, {
        data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
      setEditLoading(false);
    }
  };

  const replySubmitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
    mentionData: string[];
  }) => {
    setReplyLoading(true);
    try {
      await API.post(`/comments/sub/new/${comment._id}`, {
        data,
      });
      await singleCmtMutate();
      await subCmtMutate();
      setReplyLoading(false);
      await setSize(comment.totalSubCmtPages + 1);
      await setReplyData(null);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const findSize = async () => {
    let size: number = 1;
    try {
      const response: { result: number } = await API.get(
        `/comments/sub/checkSize/${cmtid}?breakpoint=${subcmtid}`
      );
      size = response.result;
    } catch (error) {}
    return size;
  };

  const setFindSize = async () => {
    if (cmtid && subcmtid) {
      const size = await findSize();
      await setSize(size);
      await subCmtMutate();
    }
  };

  useEffect(() => {
    if (
      !cmtid &&
      !subcmtid &&
      subCmtData &&
      size > comment.totalSubCmtPages &&
      size !== 1
    ) {
      setSize(size - 1);
    }
  }, [subCmtData]);

  useEffect(() => {
    if (cmtid && !subcmtid) {
      if (comment.totalSubCmtPages <= 3) setSize(comment.totalSubCmtPages);
      else setSize(3);
    }
    if (cmtid && subcmtid) setFindSize();
    if (cmtid && inputRef.current) inputRef.current.scrollIntoView(false);
  }, [cmtid, subcmtid]);

  useEffect(() => {
    if (replyData && cmtid) replySubmitHandle(replyData);
  }, [replyData]);

  const showReplyFooter =
    (subCmtData && subCmtData[0]?.result.length !== 0) ||
    (subCmtData && subCmtData[0]?.result.length !== 0 && cmtid);
  return (
    <CommentRowWrapper ref={commentWrapperEle}>
      <StoryCommentRowContext.Provider
        value={{
          subCmtMutate,
          mutate,
          mainCmtId: comment._id,
          subCmtIsValidating,
        }}
      >
        <CommentRow>
          <CommentRowContentWrapper
            sx={{
              display: editing ? "flex" : "inline-flex",
            }}
          >
            <Stack direction={"row"} width={"100%"} alignItems={"center"}>
              <CommentRowContentInner ref={commentRowRef}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Box>
                    <PosterSpanStyled>
                      {comment?.author.gender === "male" ? (
                        <Box
                          component={MaleIcon}
                          sx={{
                            color: "#2196f3",
                          }}
                        />
                      ) : (
                        <Box
                          component={FemaleIcon}
                          sx={{
                            color: "#e91e63",
                          }}
                        />
                      )}
                      {comment?.author.user_id}
                    </PosterSpanStyled>
                  </Box>
                  <Link
                    underline="none"
                    onClick={(e) => {
                      e.preventDefault();
                      if (profile) {
                        setSubReplyTo({
                          user_id: comment?.author.user_id,
                          _id: comment?.author._id,
                        });
                        query = {
                          ...query,
                          cmtid: comment._id,
                          reply: "true",
                        };
                        router.replace({ pathname, query }, undefined, {
                          shallow: true,
                        });
                      } else
                        router.push({
                          pathname: "/login",
                          query: {
                            goAround: true,
                          },
                        });
                    }}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <ReplyIcon fontSize="small" /> Trả lời
                  </Link>
                </Stack>
                <Divider />
                {editing ? (
                  <>
                    <CommentEditor
                      cb={submitHandle}
                      clicked={editSubmitClicked}
                      setClicked={setEditSubmitClicked}
                      defaultValue={comment?.mainValue}
                    />
                    <IconWrapper>
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
                        onClick={() => setEditSubmitClicked(true)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </IconWrapper>
                  </>
                ) : editLoading ? (
                  <Box my={1}>
                    <CircularProgress size="1em" /> Đang cập nhật...
                  </Box>
                ) : (
                  <StoryCommentContent
                    mainValue={comment?.mainValue}
                    truncatedValue={comment?.truncatedValue}
                  />
                )}
              </CommentRowContentInner>

              <CommentMenuDropDown comment={comment} setEditing={setEditing} />
            </Stack>
          </CommentRowContentWrapper>
        </CommentRow>
        {replyLoading && (
          <Box
            my={1}
            sx={{
              color: "myText.primary",
              fontSize: ".9em",
              width: "100%",
              textAlign: "center",
            }}
          >
            <CircularProgress size="1em" /> Đang gửi trả lời...
          </Box>
        )}

        {showReplyFooter && (
          <Stack direction={"row"}>
            <Box
              minWidth={"30px"}
              textAlign={"right"}
              sx={{
                color: "myText.primary",
              }}
            >
              <SubdirectoryArrowRightIcon />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              {subCmtData &&
                subCmtData.map((group: any) => {
                  return group?.result.map((sub: SubCommentDataInterface) => {
                    return (
                      <MemorizedStorySubCommentRow
                        key={sub._id}
                        subCmtData={sub}
                      />
                    );
                  });
                })}
              {size < comment.totalSubCmtPages && (
                <Link
                  underline="none"
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItem: "center",
                  }}
                  onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();
                    setSize(size + 1);
                  }}
                >
                  <KeyboardArrowDownIcon />
                  Xem thêm bình luận mới
                </Link>
              )}
            </Box>
          </Stack>
        )}

        {subCmtIsValidating && (
          <Box
            my={1}
            sx={{
              color: "myText.primary",
              fontSize: ".9em",
              width: "100%",
              paddingLeft: "5%",
            }}
          >
            <CircularProgress size="1em" /> Đang tải...
          </Box>
        )}
        {comment && !subcmtid && comment.totalSubCmt > 0 && !subCmtData && (
          <Link
            underline="none"
            sx={{
              cursor: "pointer",
              marginLeft: "5%",
              display: "flex",
              alignItem: "center",
            }}
            onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              subCmtMutate();
            }}
          >
            <ExpandMoreIcon />
            Xem trả lời cho bình luận này
          </Link>
        )}
      </StoryCommentRowContext.Provider>
    </CommentRowWrapper>
  );
};

const MemorizedStoryCommentRow = React.memo(StoryCommentRow);

export default MemorizedStoryCommentRow;
