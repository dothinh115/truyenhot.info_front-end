import { AdminLayoutContext } from "@/layouts";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { ListItemIcon } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton/";
import ListItemText from "@mui/material/ListItemText/";
import ListSubheader from "@mui/material/ListSubheader";
import Link from "next/link";
import { useContext } from "react";
import { StoriesManage } from "./storiesManage";
import { UsersManage } from "./usersManage";

type Props = {};

export const AdminSidebar = (props: Props) => {
  const { setOpen } = useContext<any>(AdminLayoutContext);

  return (
    <>
      <List
        className="admin-list-style"
        component="nav"
        subheader={
          <ListSubheader component="h1">ADMIN DASHBOARD</ListSubheader>
        }
      >
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/admin"
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText disableTypography primary="Tổng quan" />
          </ListItemButton>
        </ListItem>
      </List>

      <List
        className="admin-list-style"
        component="nav"
        subheader={<ListSubheader component="h1">QUẢN LÝ TRUYỆN</ListSubheader>}
      >
        <StoriesManage />
      </List>

      <List
        className="admin-list-style"
        component="nav"
        subheader={
          <ListSubheader component="h1">QUẢN LÝ NGƯỜI DÙNG</ListSubheader>
        }
      >
        <UsersManage />
      </List>
      <List
        sx={{
          display: {
            md: "none",
            xs: "block",
          },
        }}
      >
        <ListItem>
          <ListItemButton
            onClick={() => setOpen(false)}
            sx={{
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <CloseIcon />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};
