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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
  const {
    replyData,
    setReplyData,
    singleCmtMutate,
    setSubReplyTo,
    commentWrapper,
  } = useContext<any>(StoryCommentButtonContext);
  const router = useRouter();
  let { pathname, query } = router;
  const { cmtid, subcmtid } = router.query;

  const [editing, setEditing] = useState<boolean>(false);
  const commentWrapperEle = useRef<HTMLDivElement>(null);
  const commentRowRef = useRef<HTMLDivElement>(null);
  const [editSubmitClicked, setEditSubmitClicked] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const [subCmtData, setSubCmtData] = useState<any[]>([]);
  const [range, setRange] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: 0,
  });

  const editSubComment = async (
    data: {
      truncatedValue: string;
      mainValue: string;
    },
    _id: string
  ) => {
    try {
      setEditing(false);
      const response: { result: any } = await API.put(
        `/comments/sub/edit/${_id}`,
        {
          data,
        }
      );
      await getData(1, true);
      query = {
        ...query,
        subcmtid: response.result._id,
      };
      await router.replace({ pathname, query }, undefined, { shallow: true });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommentHandle = async (url: string) => {
    try {
      await API.delete(url);
    } catch (error) {
      console.log(error);
    } finally {
      await getData(1, true);
    }
  };

  const getData = async (
    page: number,
    fromRange: boolean = false,
    join: boolean = false
  ) => {
    if (fromRange) {
      try {
        let arr: any[] = [];
        for (let i = range.start; i <= range.end; i++) {
          const response: { result: SubCommentDataInterface[] } = await API.get(
            `/comments/sub/getSubCommentByCommentId/${comment._id}?page=${i}`
          );
          arr = [
            ...arr,
            {
              result: response.result,
            },
          ];
          setSubCmtData(arr);
        }
      } catch (error) {
        console.log(error);
      }
      return;
    }

    try {
      const response: { result: SubCommentDataInterface[] } = await API.get(
        `/comments/sub/getSubCommentByCommentId/${comment._id}?page=${page}`
      );
      if (join) {
        if (query.subcmtid) delete query.subcmtid;
        router.replace({ pathname, query }, undefined, { shallow: true });
        console.log(page, range);
        if (page < range.start) {
          setSubCmtData([
            {
              result: response.result,
            },
            ...subCmtData,
          ]);
          setRange({
            ...range,
            start: page,
          });
          return;
        } else if (page > range.end) {
          setSubCmtData([
            ...subCmtData,
            {
              result: response.result,
            },
          ]);
          setRange({
            ...range,
            end: page,
          });
          return;
        }
      } else {
        setSubCmtData([{ result: response.result }]);
        setRange({
          start: page,
          end: page,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      mutate();
      setEditLoading(false);
    }
  };

  const replySubmitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
    mentionData: string[];
  }) => {
    await setReplyLoading(true);
    try {
      const response: { result: any } = await API.post(
        `/comments/sub/new/${comment._id}`,
        {
          data,
        }
      );
      await singleCmtMutate();
      query = {
        ...query,
        subcmtid: response.result._id,
      };
      await router.replace({ pathname, query }, undefined, { shallow: true });
      if (commentWrapper.current)
        commentWrapper.current.scroll({
          top: commentWrapper.current.scrollHeight,
        });
      await setReplyData(null);
      setReplyLoading(false);
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
    if (cmtid || subcmtid) {
      if (subcmtid) {
        const size = await findSize();
        await getData(
          size,
          range.start !== 0 && range.end !== 0 ? true : false
        );
        return;
      }
      if (subCmtData.length === 0) {
        await getData(1);
        setRange({
          start: 1,
          end: 1,
        });
      }
    }
  };

  useEffect(() => {
    if (cmtid || subcmtid) setFindSize();
  }, [cmtid, subcmtid]);

  useEffect(() => {
    if (replyData && cmtid) replySubmitHandle(replyData);
  }, [replyData]);

  const showReplyFooter =
    (comment.totalSubCmt > 0 && subCmtData.length !== 0) ||
    (comment.totalSubCmt > 0 && cmtid);
  return (
    <CommentRowWrapper ref={commentWrapperEle}>
      <StoryCommentRowContext.Provider
        value={{
          mutate,
          mainCmtId: comment._id,
          editSubComment,
          deleteCommentHandle,
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
              {range.start > 1 && (
                <Link
                  underline="none"
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItem: "center",
                  }}
                  onClick={async (
                    event: React.MouseEvent<HTMLAnchorElement>
                  ) => {
                    event.preventDefault();
                    await getData(range.start - 1, false, true);
                  }}
                >
                  <KeyboardArrowUpIcon />
                  Xem thêm bình luận cũ
                </Link>
              )}
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
              {subCmtData.length !== 0 &&
                range.end < comment.totalSubCmtPages && (
                  <Link
                    underline="none"
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItem: "center",
                    }}
                    onClick={async (
                      event: React.MouseEvent<HTMLAnchorElement>
                    ) => {
                      event.preventDefault();
                      await getData(range.end + 1, false, true);
                    }}
                  >
                    <KeyboardArrowDownIcon />
                    Xem thêm bình luận mới
                  </Link>
                )}
            </Box>
          </Stack>
        )}

        {comment.totalSubCmt > 0 &&
          range.end < comment.totalSubCmtPages &&
          subCmtData.length === 0 && (
            <Link
              underline="none"
              sx={{
                cursor: "pointer",
                marginLeft: "5%",
                display: "flex",
                alignItem: "center",
              }}
              onClick={async (event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                await getData(1);
                setRange({
                  start: 1,
                  end: 1,
                });
              }}
            >
              <ExpandMoreIcon />
              Xem trả lời cho bình luận này
            </Link>
          )}
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
      </StoryCommentRowContext.Provider>
    </CommentRowWrapper>
  );
};

const MemorizedStoryCommentRow = React.memo(StoryCommentRow);

export default MemorizedStoryCommentRow;
