import { useAuth } from "@/hooks/auth/useAuth";
import {
  CommentDataInterface,
  SubCommentDataInterface,
} from "@/models/stories";
import { API, PermissionVariables } from "@/utils/config";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReplyIcon from "@mui/icons-material/Reply";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

type Props = {
  mutate: () => void;
  setReplying: (reply: boolean) => void;
  comment: CommentDataInterface | SubCommentDataInterface;
  setEditing: (edit: boolean) => void;
  subCmt?: boolean;
};

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
const CommentMenuDropDown = ({
  mutate,
  setReplying,
  comment,
  setEditing,
  subCmt = false,
}: Props) => {
  const menuDropdownIcon = useRef<HTMLButtonElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { profile } = useAuth();
  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/comments${subCmt ? "/sub" : ""}/delete/${_id}`);
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
  useEffect(() => {
    window.addEventListener("click", menuDropdownClickHandle);
    return () => {
      window.removeEventListener("click", menuDropdownClickHandle);
    };
  }, []);
  return (
    <>
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
            <ListItemButton
              onClick={() => {
                if (profile) setReplying(true);
                else
                  router.push({
                    pathname: "/login",
                    query: {
                      backTo: router.asPath,
                    },
                  });
              }}
            >
              <ListItemIcon>
                <ReplyIcon />
              </ListItemIcon>
              <ListItemText
                sx={{ color: "myText.primary" }}
                primary="Trả lời"
              />
            </ListItemButton>
            {profile &&
              (profile?.result._id === comment.author._id ||
                profile?.result.permission > PermissionVariables.Editors) && (
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
    </>
  );
};

export default CommentMenuDropDown;
