import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Collapse, ListItemIcon } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton/";
import ListItemText from "@mui/material/ListItemText/";
import Link from "next/link";
import { useState, useContext } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import { AdminLayoutContext } from "@/layouts";

type Props = {};

export const StoriesManage = (props: Props) => {
  const { setOpen } = useContext<any>(AdminLayoutContext);
  const [storiesMenuOpen, setStoriesMenuOpen] = useState(false);
  const handleClick = () => {
    setStoriesMenuOpen(!storiesMenuOpen);
  };
  return (
    <>
      <ListItemButton
        component={Link}
        href="/admin/stories"
        onClick={() => setOpen(false)}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary="Thêm gần đây" />
      </ListItemButton>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Thêm" />
        {storiesMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={storiesMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            href="/admin/stories/new"
            sx={{
              pl: 4,
            }}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary="Đăng truyện mới"
            ></ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/admin/categories/new"
            sx={{
              pl: 4,
            }}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Thêm thể loại" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};
