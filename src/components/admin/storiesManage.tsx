import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Collapse from "@mui/material/Collapse";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton/";
import ListItemText from "@mui/material/ListItemText/";
import Link from "next/link";
import { useContext, useState } from "react";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import ReportIcon from "@mui/icons-material/Report";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { AdminLayoutContext } from "@/layouts/admin";
type Props = {};

export const StoriesManage = (props: Props) => {
  const { setOpen } = useContext<any>(AdminLayoutContext);
  const [storiesMenuOpen, setStoriesMenuOpen] = useState<boolean>(false);
  const [reportMenuOpen, setReportMenuOpen] = useState<boolean>(false);

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

      <ListItemButton
        component={Link}
        href="/admin/stories/noCover"
        onClick={() => setOpen(false)}
      >
        <ListItemIcon>
          <BookmarkRemoveIcon />
        </ListItemIcon>
        <ListItemText primary="Chưa có Cover" />
      </ListItemButton>

      <ListItemButton onClick={() => setReportMenuOpen(!reportMenuOpen)}>
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary="Report" />
        {reportMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={reportMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            component={Link}
            href="/admin/stories/report/new"
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
              primary="Thêm lỗi mới"
            ></ListItemText>
          </ListItemButton>
          <ListItemButton
            component={Link}
            href="/admin/stories/report"
            sx={{
              pl: 4,
            }}
            onClick={() => setOpen(false)}
          >
            <ListItemIcon>
              <ReportProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Xem report" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={() => setStoriesMenuOpen(!storiesMenuOpen)}>
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
