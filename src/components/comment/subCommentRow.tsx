import { useAuth } from "@/hooks/auth/useAuth";
import { SubCommentDataInterface } from "@/models/stories";
import { API } from "@/utils/config";
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
import React, { useState } from "react";
import CommentMenuDropDown from "./menuDropDown";
const CommentEditor = dynamic(() => import("./editor/wrapperEditor"));
const StoryCommentContent = dynamic(() => import("./commentContent"));

type Props = {
  subCmtData: SubCommentDataInterface;
  mutate: any;
  setReplying: any;
  setSubReplyTo: any;
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

const StorySubCommentRow = ({
  subCmtData,
  mutate,
  setReplying,
  setSubReplyTo,
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitClick, setSubmitClick] = useState<boolean>(false);
  const { profile } = useAuth();
  const router = useRouter();
  const submitHandle = async (data: {
    truncatedValue: string;
    mainValue: string;
  }) => {
    setLoading(true);
    try {
      setEditing(false);
      await API.put(`/comments/sub/edit/${subCmtData._id}`, {
        data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
      setLoading(false);
    }
  };

  return (
    <SubCommentWrapper>
      <SubCommentInner>
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
                setReplying(true);
                setSubReplyTo(subCmtData?.author.user_id);
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

      <CommentMenuDropDown
        comment={subCmtData}
        mutate={mutate}
        setEditing={setEditing}
        setReplying={setReplying}
        subCmt={true}
      />
    </SubCommentWrapper>
  );
};

const MemorizedStorySubCommentRow = React.memo(StorySubCommentRow);

export default MemorizedStorySubCommentRow;
