import { useAuth } from "@/hooks/auth/useAuth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
type Props = {};

const DropdownMenu = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "250px",
  right: 0,
  top: "calc(100% + 5px)",
  backgroundColor: theme.palette.myBackground.secondary,
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.4)}`,
  zIndex: 10,
  display: "none",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));

const ListStyled = styled(List)(({ theme }) => ({
  padding: 0,
  "& > *": {
    padding: "8px",
    borderBottom: `1px solid ${alpha(
      theme.palette.mySecondary.boxShadow,
      0.2
    )}`,
    "& *": {
      color: theme.palette.myText.primary,
    },
  },
}));

const HeaderDropdownMenu = (props: Props) => {
  const menuDropDownButton = useRef<HTMLButtonElement>(null);
  const menuDropDown = useRef<HTMLDivElement>(null);
  const { profile, logout } = useAuth();
  const router = useRouter();
  const dropDownMenuHandle = (event: { target: any }) => {
    if (menuDropDown?.current && menuDropDownButton?.current) {
      if (menuDropDownButton?.current?.contains(event.target)) {
        if (menuDropDown!.current.style.display === "block") {
          menuDropDown!.current.style.display = "none";
        } else {
          menuDropDown!.current.style.display = "block";
        }
      } else {
        menuDropDown!.current.style.display = "none";
      }
    }
  };
  useEffect(() => {
    window.addEventListener("click", dropDownMenuHandle);
    return () => {
      window.removeEventListener("click", dropDownMenuHandle);
    };
  }, []);
  return (
    <Box
      sx={{
        position: "relative",
        display: {
          md: "inline-flex",
          xs: "none",
        },
      }}
    >
      <IconButton ref={menuDropDownButton} title="Menu">
        <PersonIcon />
      </IconButton>
      <DropdownMenu ref={menuDropDown}>
        <ListStyled>
          {profile ? (
            <>
              <ListItem>
                <ListItemIcon
                  sx={{ minWidth: "unset", marginRight: "8px" }}
                  title="Profile"
                >
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    "&>span": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                  primary={profile.result.email}
                />
              </ListItem>
              <ListItemButton title="Đăng xuất" onClick={() => logout()}>
                <ListItemIcon sx={{ minWidth: "unset", marginRight: "8px" }}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton
                title="Đăng nhập"
                onClick={() =>
                  router.push({
                    pathname: "/login",
                    query: {
                      goAround: true,
                    },
                  })
                }
              >
                <ListItemIcon sx={{ minWidth: "unset", marginRight: "8px" }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng nhập" />
              </ListItemButton>

              <ListItemButton
                title="Đăng ký"
                onClick={() =>
                  router.push({
                    pathname: "/register",
                    query: {
                      goAround: true,
                    },
                  })
                }
              >
                <ListItemIcon sx={{ minWidth: "unset", marginRight: "8px" }}>
                  <HowToRegIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng ký" />
              </ListItemButton>
            </>
          )}
        </ListStyled>
      </DropdownMenu>
    </Box>
  );
};

export default HeaderDropdownMenu;
