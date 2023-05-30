import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton/";
import ListItemText from "@mui/material/ListItemText/";
import GroupIcon from "@mui/icons-material/Group";
import Link from "next/link";
type Props = {};

export const UsersManage = (props: Props) => {
  return (
    <>
      <ListItemButton component={Link} href="/admin/users/list">
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="Danh sách users" />
      </ListItemButton>
    </>
  );
};
