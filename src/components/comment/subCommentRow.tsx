import { useAuth } from "@/hooks/auth/useAuth";
import { SubCommentDataInterface } from "@/models/stories";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import ReplyIcon from "@mui/icons-material/Reply";
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
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StoryCommentButtonContext,
  StoryCommentButtonContextInterface,
} from "../stories/commentButton";
import {
  StoryCommentRowContext,
  StoryCommentRowContextInterface,
} from "./commentRow";

const CommentEditor = dynamic(() => import("./editor/wrapperEditor"));
const StoryCommentContent = dynamic(() => import("./commentContent"));
const CommentMenuDropDown = dynamic(() => import("./menuDropDown"));
type Props = {
  subCmtData: SubCommentDataInterface;
};

const SubCommentWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  paddingBottom: theme.spacing(0.5),
}));

const SubCommentInner = styled(Stack)(({ theme }) => ({
  width: "calc(100% - 45px)",
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
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

export interface StorySubCommentRowContextInterface {
  setEditing?: (bool: boolean) => void;
}

export const StorySubCommentRowContext =
  createContext<StorySubCommentRowContextInterface>({});

const StorySubCommentRow = ({ subCmtData }: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitClick, setSubmitClick] = useState<boolean>(false);
  const { profile } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const commentRowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  let { pathname, query } = router;
  let { cmtid } = query;
  const { subcmtid } = router.query;
  const { setSubReplyTo } = useContext<StoryCommentButtonContextInterface>(
    StoryCommentButtonContext
  );
  const { editSubComment } = useContext<StoryCommentRowContextInterface>(
    StoryCommentRowContext
  );

  const submitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
    mentionData: string[];
  }) => {
    setLoading(true);
    if (editSubComment) await editSubComment(data, subCmtData._id);
    setEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    if (
      subCmtData._id === subcmtid &&
      wrapperRef.current &&
      commentRowRef.current
    ) {
      commentRowRef.current.classList.add("markComment");
      if (wrapperRef.current) wrapperRef.current.scrollIntoView(false);
    } else {
      if (commentRowRef.current)
        commentRowRef.current.classList.remove("markComment");
    }
  }, [subcmtid]);

  return (
    <SubCommentWrapper ref={wrapperRef}>
      <StorySubCommentRowContext.Provider value={{ setEditing }}>
        <SubCommentInner ref={commentRowRef}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box>
              <PosterSpanStyled>
                {subCmtData?.author.gender === "male" ? (
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
                {subCmtData?.author.user_id}
              </PosterSpanStyled>
            </Box>
            <Link
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                if (profile) {
                  query = {
                    ...query,
                    cmtid: subCmtData.parent_id,
                    ...(!cmtid && { subcmtid: subCmtData._id }),
                  };
                  router.replace({ pathname, query }, undefined, {
                    shallow: true,
                  });
                  if (setSubReplyTo)
                    setSubReplyTo({
                      user_id: subCmtData?.author.user_id,
                      _id: subCmtData?.author._id,
                    });
                } else
                  router.push({
                    pathname: "/login",
                    query: {
                      goAround: true,
                    },
                  });
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
                clicked={submitClick}
                setClicked={setSubmitClick}
                defaultValue={subCmtData?.mainValue}
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
                  onClick={() => setSubmitClick(true)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </IconWrapper>
            </>
          ) : (
            <>
              {loading ? (
                <Box my={1}>
                  <CircularProgress size={"1em"} /> Đang cập nhật...
                </Box>
              ) : (
                <StoryCommentContent
                  mainValue={subCmtData?.mainValue}
                  truncatedValue={subCmtData?.truncatedValue}
                />
              )}
            </>
          )}
        </SubCommentInner>

        <CommentMenuDropDown comment={subCmtData} IsSubCmt={true} />
      </StorySubCommentRowContext.Provider>
    </SubCommentWrapper>
  );
};

const MemorizedStorySubCommentRow = StorySubCommentRow;

export default MemorizedStorySubCommentRow;
