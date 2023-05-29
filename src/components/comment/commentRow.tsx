import { useAuth } from "@/hooks/auth";
import {
  CommentDataInterface,
  SubCommentDataInterface,
} from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import { strip_tags, timeSince } from "@/utils/function";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReplyIcon from "@mui/icons-material/Reply";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  Box,
  Divider,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  alpha,
  styled,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  CompositeDecorator,
  Editor,
  EditorState,
  convertFromRaw,
} from "draft-js";
import React, { createContext, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { MentionSpanStyled } from "./commentEditor";
import { MemorizedStorySubCommentRow } from "./subCommentRow";
import dynamic from "next/dynamic";
const CommentEditor = dynamic(() => import("./commentEditor"));

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

const ReplyInputWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.myText.primary,
  width: "calc(100% - 45px)",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0, 0.5),
  flexWrap: "wrap",
}));

type Props = {
  comment: CommentDataInterface;
  mutate: () => void;
};

export const CommentContext = createContext({});

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

export const StoryCommentRow = ({ comment, mutate }: Props) => {
  const { profile } = useAuth();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );

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

  const [show, setShow] = useState<boolean>(false);
  const menuDropdownIcon = useRef<HTMLButtonElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [replying, setReplying] = useState<boolean>(false);
  const commentWrapperEle = useRef<HTMLDivElement>(null);
  const [editSubmitClicked, setEditSubmitClicked] = useState<boolean>(false);
  const [replySubmitClicked, setReplySubmitClicked] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [replyLoading, setReplyLoading] = useState<boolean>(false);
  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/comments/delete/${_id}`);
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

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

  const submitHandle = async (data: string) => {
    const comment_content = strip_tags(data, "b", "i", "u", "br");
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
    const comment_content = strip_tags(data, "b", "i", "u", "br");
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

  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(comment?.comment_content)),
        decorator
      )
    );
  }, [comment]);

  useEffect(() => {
    window.addEventListener("click", menuDropdownClickHandle);
    return () => {
      window.removeEventListener("click", menuDropdownClickHandle);
    };
  }, []);

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
                  </Box>
                </Box>
                <Link
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    setReplying(!replying);
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
                      onClick={() => setEditSubmitClicked(true)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Stack>
                </>
              ) : (
                <>
                  {editLoading ? (
                    <Box my={1}>
                      <CircularProgress size="1em" /> Đang cập nhật...
                    </Box>
                  ) : (
                    <>
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

                      <Box textAlign={"right"}>
                        {comment?.comment_content.length > 400 && !show && (
                          <IconButton
                            size="small"
                            onClick={() => setShow(true)}
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                        )}
                      </Box>
                    </>
                  )}
                </>
              )}
            </CommentRowContentInner>

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
                  {(profile?.result._id === comment.author._id ||
                    profile?.result.permission >
                      PermissionVariables.Editors) && (
                    <>
                      <ListItemButton onClick={() => deleteHandle(comment._id)}>
                        <ListItemIcon color="error">
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
                </Stack>
              </ReplyInputWrapper>
            )}
            <CommentContext.Provider value={{ setSubReplyTo }}>
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
                      />
                    );
                  });
                })}
            </CommentContext.Provider>
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
