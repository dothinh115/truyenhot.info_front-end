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
import { useState } from "react";

type Props = {};

export const StoriesManage = (props: Props) => {
  const [storiesMenuOpen, setStoriesMenuOpen] = useState(false);
  const handleClick = () => {
    setStoriesMenuOpen(!storiesMenuOpen);
  };
  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Truyện" />
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
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary="Đăng truyện mới"
            ></ListItemText>
          </ListItemButton>
        </List>

        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            href="/admin/stories"
            sx={{
              pl: 4,
            }}
          >
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary="Truyện đã đăng"
            ></ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};
