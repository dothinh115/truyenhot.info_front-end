import { useAuth } from "@/hooks/auth";
import { SubCommentDataInterface } from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import { strip_tags, timeSince } from "@/utils/function";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  alpha,
  styled,
  Link,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  CompositeDecorator,
  Editor,
  EditorState,
  convertFromRaw,
} from "draft-js";
import { CommentEditor, MentionSpanStyled } from "./commentEditor";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { CommentContext } from "./commentRow";
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

const getEntityStrategy = (mutability: string) => {
  return function (contentBlock: any, callback: any, contentState: any) {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
};

const MentionSpan = (props: any) => {
  return (
    <MentionSpanStyled data-offset-key={props.offsetkey}>
      {props.children}
    </MentionSpanStyled>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("IMMUTABLE"),
    component: MentionSpan,
  },
]);
export const StorySubCommentRow = ({
  subCmtData,
  mutate,
  setReplying,
}: Props) => {
  const { profile } = useAuth();
  const menuDropdownIcon = useRef<HTMLButtonElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitClick, setSubmitClick] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

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
    const comment_content = strip_tags(data, "b", "i", "u", "br");
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
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(subCmtData?.comment_content)),
        decorator
      )
    );
  }, [subCmtData]);

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
            <Box
              component={"span"}
              sx={{
                color: "myText.heading",
                margin: 0,
                fontSize: "1.1em",
                fontWeight: "bold",
                marginRight: "5px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
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
              <Box
                sx={{
                  color: "myText.primary",
                  fontSize: ".7em",
                  marginLeft: "4px",
                }}
              >
                (
                {`${timeSince(
                  Math.abs(
                    new Date().valueOf() -
                      new Date(subCmtData?.created_at).valueOf()
                  )
                )} trước`}
                )
              </Box>
            </Box>
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
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              sx={{
                fontSize: ".8em",
              }}
              gap={"5px"}
            >
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
            </Stack>
          </>
        ) : (
          <>
            {loading ? (
              <Box my={1}>
                <CircularProgress size={"1em"} /> Đang cập nhật...
              </Box>
            ) : (
              <Box
                sx={{
                  "& p": {
                    margin: 0,
                  },
                }}
                my={"4px"}
              >
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  readOnly={true}
                />
              </Box>
            )}

            <Box textAlign={"right"}>
              {subCmtData?.comment_content.length > 400 && !show && (
                <IconButton size="small" onClick={() => setShow(true)}>
                  <ExpandMoreIcon />
                </IconButton>
              )}
            </Box>
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

export const MemorizedStorySubCommentRow = React.memo(StorySubCommentRow);
