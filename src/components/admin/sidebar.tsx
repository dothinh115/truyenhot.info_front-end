import HomeIcon from "@mui/icons-material/Home";
import { Box, ListItemIcon } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton/";
import ListItemText from "@mui/material/ListItemText/";
import ListSubheader from "@mui/material/ListSubheader";
import Link from "next/link";
import { StoriesManage } from "./storiesManage";
import { UsersManage } from "./usersManage";

type Props = {};

export const AdminSidebar = (props: Props) => {
  return (
    <Box
      width={"20%"}
      minHeight={"100vh"}
      flexGrow={1}
      sx={{
        backgroundColor: "#1a237e",
      }}
    >
      <List
        className="admin-list-style"
        component="nav"
        subheader={
          <ListSubheader component="h1">ADMIN DASHBOARD</ListSubheader>
        }
      >
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/admin">
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
    </Box>
  );
};
