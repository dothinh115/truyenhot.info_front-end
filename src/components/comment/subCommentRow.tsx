import { useAuth } from "@/hooks/auth/useAuth";
import { SubCommentDataInterface } from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReplyIcon from "@mui/icons-material/Reply";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CommentContext } from "./commentRow";

const CommentEditor = dynamic(() => import("./commentEditor"));
const StoryCommentContent = dynamic(() => import("./commentContent"));

type Props = {
  subCmtData: SubCommentDataInterface;
  mutate: any;
  setReplying: any;
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

const MenuDropdownWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "150px",
  backgroundColor: theme.palette.myBackground.secondary,
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.4)}`,
  right: 0,
  top: "100%",
  display: "none",
  zIndex: 50,
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

const StorySubCommentRow = ({ subCmtData, mutate, setReplying }: Props) => {
  const { profile } = useAuth();
  const menuDropdownIcon = useRef<HTMLButtonElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitClick, setSubmitClick] = useState<boolean>(false);
  const { setSubReplyTo } = useContext<any>(CommentContext);

  const menuDropdownClickHandle = (event: { target: any }) => {
    if (menuDropdown?.current) {
      if (menuDropdownIcon?.current?.contains(event.target)) {
        if (menuDropdown.current.style.display === "block") {
          menuDropdown.current.style.display = "none";
        } else menuDropdown.current.style.display = "block";
      } else {
        if (menuDropdown?.current) menuDropdown.current.style.display = "none";
      }
    }
  };

  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/comments/sub/delete/${_id}`);

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandle = async (data: string) => {
    const comment_content = data;
    if (comment_content === "") return;
    setLoading(true);
    try {
      setEditing(false);
      await API.put(`/comments/sub/edit/${subCmtData._id}`, {
        comment_content,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await mutate();
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", menuDropdownClickHandle);
    return () => {
      window.removeEventListener("click", menuDropdownClickHandle);
    };
  }, []);

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
              setSubReplyTo(subCmtData?.author.user_id);
              setReplying(true);
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
              defaultValue={subCmtData.comment_content}
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
                comment_content={subCmtData?.comment_content}
              />
            )}
          </>
        )}
      </SubCommentInner>

      <Box
        sx={{
          display: "inline-block",
          marginLeft: "5px",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            width: "40px",
            height: "40px",
          }}
          ref={menuDropdownIcon}
        >
          <MoreHorizIcon />
        </IconButton>
        <MenuDropdownWrapper ref={menuDropdown}>
          <List
            dense={true}
            sx={{
              padding: 0,
            }}
          >
            <ListItemButton onClick={() => setReplying(true)}>
              <ListItemIcon>
                <ReplyIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "myText.primary" }}
                primary="Trả lời"
              />
            </ListItemButton>
            {(profile?.result._id === subCmtData.author._id ||
              profile?.result.permission > PermissionVariables.Editors) && (
              <>
                <ListItemButton onClick={() => deleteHandle(subCmtData._id)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ color: "myText.primary" }}
                    primary="Xóa"
                  />
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sửa"
                    sx={{ color: "myText.primary" }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
        </MenuDropdownWrapper>
      </Box>
    </SubCommentWrapper>
  );
};

const MemorizedStorySubCommentRow = React.memo(StorySubCommentRow);

export default MemorizedStorySubCommentRow;
