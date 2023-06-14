import { useAuth } from "@/hooks/auth/useAuth";
import { NotificationInterface } from "@/models/notifications/noti.model";
import { API } from "@/utils/config";
import { timeSince } from "@/utils/function";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
type Props = {};

const ModalInner = styled(Stack)(({ theme }) => ({
  position: "fixed",
  backgroundColor: theme.palette.myBackground.default,
  zIndex: 100,
  padding: theme.spacing(1),
  overflow: "hidden",
  [theme.breakpoints.up("xs")]: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "unset",
    transform: "unset",
    minWidth: "unset",
  },
  [theme.breakpoints.up("md")]: {
    top: "50%",
    left: "50%",
    width: "40%",
    height: "80%",
    borderRadius: theme.spacing(2),
    transform: "translate(-50%, -50%)",
    minWidth: "600px",
  },
}));

const HeaddingStyled = styled(Box)(() => ({
  width: "100%",
  top: 0,
  left: 0,
}));

const NotiWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  flexGrow: 1,
  padding: 0,
  margin: theme.spacing(2, 0),
  overflow: "auto",
  "&::-webkit-scrollbar": {
    borderRadius: "0 16px 16px 0",
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
}));

const NotiRowWrapper = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.myBackground.secondary,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  color: theme.palette.myText.primary,
  padding: theme.spacing(1),
  textDecoration: "none",
  cursor: "pointer",
}));

const NotiRowInner = styled(Stack)(() => ({
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
}));

const NotificationButton = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [unread, setUnread] = useState<number>(0);
  const onCloseHandle = () => setOpen(false);
  const { profile } = useAuth();
  const getKey = (pageIndex: number) => {
    pageIndex = pageIndex + 1;
    return profile ? `/notification/getNotification?page=${pageIndex}` : null;
  };

  const { data: notiData, mutate: notiMutate } = useSWRInfinite(getKey, {
    keepPreviousData: true,
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const getUnreadNotification = (): number => {
    let unreadNoti: number = 0;
    if (notiData) {
      for (let group of notiData) {
        const unreadArray = group.result.filter(
          (noti: NotificationInterface) => noti.read === false
        );
        if (unreadArray.length > 0) unreadNoti = unreadArray.length;
      }
    }
    return unreadNoti;
  };

  const markAsRead = async (_id?: string) => {
    try {
      await API.put(`/notification/markAsRead${_id ? `?notiId=${_id}` : ""}`);
    } catch (error) {
      console.log(error);
    } finally {
      notiMutate();
    }
  };

  useEffect(() => {
    if (notiData) {
      setUnread(getUnreadNotification());
    }
  }, [notiData]);

  if (!profile) return null;

  return (
    <>
      <Modal open={open} onClose={onCloseHandle}>
        <ModalInner>
          <HeaddingStyled>
            <Box
              component={"h1"}
              sx={{
                margin: 0,
                color: "myText.primary",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px",
                fontSize: "20px",
              }}
            >
              Thông báo
              <IconButton onClick={onCloseHandle}>
                <CloseIcon />
              </IconButton>
            </Box>
          </HeaddingStyled>
          <Box className="hr" />
          <Chip
            label="Đánh dấu tất cả đã đọc"
            variant="outlined"
            color="primary"
            sx={{
              marginTop: "8px",
              minHeight: "36px",
            }}
            onClick={() => markAsRead()}
          />

          <NotiWrapper>
            {notiData && notiData[notiData.length - 1].result.length === 0 ? (
              <Stack
                direction={"row"}
                justifyContent={"center"}
                sx={{
                  color: "myText.primary",
                }}
              >
                Chưa có Thông báo nào
              </Stack>
            ) : (
              notiData?.map((group: any) => {
                return group.result.map((noti: NotificationInterface) => {
                  const { text, url } = JSON.parse(noti.data);
                  return (
                    <NotiRowWrapper
                      href={url}
                      key={noti._id}
                      onClick={() => {
                        setOpen(false);
                        markAsRead(noti._id);
                      }}
                    >
                      <NotiRowInner>
                        <NotificationsActiveIcon
                          sx={{
                            color: noti.read
                              ? "myText.primary"
                              : "myPrimary.main",
                          }}
                        />
                        <Stack>
                          <Typography
                            sx={{
                              width: "100%",
                              fontSize: "14px",
                            }}
                          >
                            {text}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "myPrimary.main",
                            }}
                          >
                            {timeSince(
                              Math.abs(
                                new Date().valueOf() -
                                  new Date(noti?.created_at).valueOf()
                              )
                            )}{" "}
                            trước
                          </Typography>
                        </Stack>
                      </NotiRowInner>

                      <ArrowForwardIcon />
                    </NotiRowWrapper>
                  );
                });
              })
            )}
          </NotiWrapper>
        </ModalInner>
      </Modal>
      <IconButton onClick={() => setOpen(true)}>
        <Badge badgeContent={unread} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </>
  );
};

export default NotificationButton;
