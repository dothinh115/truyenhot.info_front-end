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
import React, { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Form } from "./form";
import { FormItemInput } from "./formItem";
import { MemorizedStorySubCommentRow } from "./subCommentRow";
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

const ReplyInputWrapper = styled(Stack)(({ theme }) => ({
  color: theme.palette.myText.primary,
  width: "calc(100% - 45px)",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0, 0.5),
}));

type Props = {
  comment: CommentDataInterface;
  mutate: () => void;
};

const defaultValues = {
  comment_content: "",
};

const defaultReplyValues = {
  reply_comment_content: "",
};

export const StoryCommentRow = ({ comment, mutate }: Props) => {
  const { profile } = useAuth();

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

  const submitHandle = async (data: { comment_content: string }) => {
    const comment_content = strip_tags(
      data.comment_content,
      "b",
      "i",
      "u"
    ).replaceAll("\n", "<br/>");
    if (comment_content === "") return;
    console.log(comment_content);

    try {
      setEditing(false);
      await API.put(`/comments/edit/${comment._id}`, {
        comment_content,
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const replySubmitHandle = async (data: { reply_comment_content: string }) => {
    const comment_content = strip_tags(
      data.reply_comment_content,
      "b",
      "i",
      "u"
    ).replaceAll("\n", "<br/>");
    if (comment_content === "") return;
    console.log(comment_content);
    try {
      setReplying(false);
      await API.post(`/comments/sub/new/${comment._id}`, {
        comment_content,
      });
      await mutate();
      await subCmtMutate();
    } catch (error) {
      console.log(error);
    }
  };

  const showReplyFooter =
    (subCmtData && subCmtData[0]?.result.length !== 0) || replying;

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
                    }}
                  >
                    {comment?.author.user_name}
                  </Box>
                  <Box
                    component={"span"}
                    sx={{ color: "myText.primary", fontSize: ".9em" }}
                  >
                    (
                    {`${timeSince(
                      Math.abs(
                        new Date().valueOf() -
                          new Date(comment?.created_at).valueOf()
                      )
                    )} trước`}
                    )
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
                <Form
                  defaultValues={defaultValues}
                  onSubmit={submitHandle}
                  sx={{ my: 1 }}
                >
                  <FormItemInput
                    name="comment_content"
                    disabled={profile ? false : true}
                    defaultValue={comment?.comment_content.replaceAll(
                      "<br/>",
                      "\n"
                    )}
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
                    <IconButton size="small" color="success" type="submit">
                      <CheckCircleIcon />
                    </IconButton>
                  </Stack>
                </Form>
              ) : (
                <>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html:
                        comment?.comment_content.length > 400 && !show
                          ? comment?.comment_content.substring(0, 400) + " ..."
                          : comment?.comment_content,
                    }}
                    my={"4px"}
                  />

                  <Box textAlign={"right"}>
                    {comment?.comment_content.length > 400 && !show && (
                      <IconButton size="small" onClick={() => setShow(true)}>
                        <ExpandMoreIcon />
                      </IconButton>
                    )}
                  </Box>
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
                <Form
                  defaultValues={defaultReplyValues}
                  onSubmit={replySubmitHandle}
                  sx={{
                    display: "flex",
                  }}
                >
                  <FormItemInput
                    name="reply_comment_content"
                    disabled={profile ? false : true}
                    placeholder={`Trả lời ${comment?.author.user_name}...`}
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
                    <IconButton size="small" color="success" type="submit">
                      <CheckCircleIcon />
                    </IconButton>
                  </Stack>
                </Form>
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
