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
import React, { useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import CommentMenuDropDown from "./menuDropDown";
import { useAuth } from "@/hooks/auth/useAuth";

const CommentEditor = dynamic(() => import("./editor/wrapperEditor"));
const MemorizedStorySubCommentRow = dynamic(() => import("./subCommentRow"));
const StoryCommentContent = dynamic(() => import("./commentContent"));
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
}));

const ReplyInputWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.myText.primary,
  width: "calc(100% - 45px)",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0, 0.5),
  flexWrap: "wrap",
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

export const StoryCommentRow = ({ comment, mutate }: Props) => {
  const [subReplyTo, setSubReplyTo] = useState<string>("");
  const getKey = (pageIndex: number, previousPageData: any) => {
    pageIndex = pageIndex + 1;
    return `/comments/sub/getSubCommentByCommentId/${comment._id}?page=${pageIndex}`;
  };

  const {
    data: subCmtData,
    size,
    setSize,
    mutate: subCmtMutate,
  } = useSWRInfinite(getKey);
  const { profile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState<boolean>(false);
  const [replying, setReplying] = useState<boolean>(false);
  const commentWrapperEle = useRef<HTMLDivElement>(null);
  const [editSubmitClicked, setEditSubmitClicked] = useState<boolean>(false);
  const [replySubmitClicked, setReplySubmitClicked] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);

  const submitHandle = async (data: string) => {
    const comment_content = data;
    if (comment_content === "") return;
    setEditLoading(true);
    try {
      setEditing(false);
      await API.put(`/comments/edit/${comment._id}`, {
        comment_content,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
      setEditLoading(false);
    }
  };

  const replySubmitHandle = async (data: string) => {
    const comment_content = data;
    if (comment_content === "") return;
    setReplyLoading(true);
    try {
      setReplying(false);

      await API.post(`/comments/sub/new/${comment._id}`, {
        comment_content,
      });

      await subCmtMutate();
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
      setReplyLoading(false);
    }
  };

  const showReplyFooter =
    (subCmtData && subCmtData[0]?.result.length !== 0) || replying;

  return (
    <CommentRowWrapper ref={commentWrapperEle}>
      <CommentRow>
        <CommentRowContentWrapper
          sx={{
            display: editing ? "flex" : "inline-flex",
          }}
        >
          <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CommentRowContentInner>
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
                    if (profile) setReplying(!replying);
                    else
                      router.push({
                        pathname: "/login",
                        query: {
                          backTo: router.asPath,
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
                    defaultValue={comment?.comment_content}
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
              ) : (
                <>
                  {editLoading ? (
                    <Box my={1}>
                      <CircularProgress size="1em" /> Đang cập nhật...
                    </Box>
                  ) : (
                    <StoryCommentContent
                      comment_content={comment?.comment_content}
                    />
                  )}
                </>
              )}
            </CommentRowContentInner>

            <CommentMenuDropDown
              comment={comment}
              mutate={mutate}
              setEditing={setEditing}
              setReplying={setReplying}
            />
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
            {replying && (
              <ReplyInputWrapper>
                <CommentEditor
                  cb={replySubmitHandle}
                  clicked={replySubmitClicked}
                  setClicked={setReplySubmitClicked}
                  placeholder={`Trả lời ${comment?.author.user_id}...`}
                  replyTo={subReplyTo ? subReplyTo : comment?.author.user_id}
                />
                <IconWrapper>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setReplying(false)}
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => setReplySubmitClicked(true)}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </IconWrapper>
              </ReplyInputWrapper>
            )}
            {subCmtData &&
              subCmtData[0]?.result.length !== 0 &&
              subCmtData.map((group: any) => {
                return group?.result.map((sub: SubCommentDataInterface) => {
                  return (
                    <MemorizedStorySubCommentRow
                      key={sub._id}
                      subCmtData={sub}
                      mutate={subCmtMutate}
                      setReplying={setReplying}
                      setSubReplyTo={setSubReplyTo}
                    />
                  );
                });
              })}
            {size < comment.totalSubCmtPages && (
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
                  setSize(size + 1);
                }}
              >
                <ExpandMoreIcon />
                Xem thêm bình luận cũ
              </Link>
            )}
          </Box>
        </Stack>
      )}
    </CommentRowWrapper>
  );
};

export const MemorizedStoryCommentRow = React.memo(StoryCommentRow);
