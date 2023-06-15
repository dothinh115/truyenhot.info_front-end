import { CategoryInterface } from "@/models/categories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Slide from "@mui/material/Slide";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { styled, alpha } from "@mui/material/styles";
import Link from "next/link";
import { useContext, useState } from "react";
import useSWR from "swr";
import { MainLayoutContext, MainLayoutContextInterface } from "@/layouts/main";
import { useAuth } from "@/hooks/auth/useAuth";

type Props = {};

const ModalInner = styled(Box)(({ theme }) => ({
  position: "fixed",
  zIndex: 100,
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.myBackground.default,
  padding: 0,
  maxHeight: "100vh",
  overflow: "auto",
  top: 0,
}));

const ModalMainHeadding = styled("h2")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: 0,
  color: alpha(theme.palette.myText.main, 0.9),
  backgroundColor: theme.palette.myBackground.main,
  padding: theme.spacing(1),
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: "100",
}));

const Wrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  margin: theme.spacing(1, 0),
  color: theme.palette.myText.primary,
  backgroundColor: theme.palette.myBackground.secondary,
  padding: "8px",
  borderRadius: "16px",
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  flexWrap: "wrap",
}));

const WrapperHeadding = styled("h4")(({ theme }) => ({
  color: theme.palette.myText.primary,
  margin: theme.spacing(1, 0),
  borderBottom: `1px dashed ${theme.palette.mySecondary.borderBottom}`,
  paddingBottom: theme.spacing(1),
  width: "100%",
}));

export const Drawer = (props: Props) => {
  const [cateShow, setCateShow] = useState<boolean>(false);
  const { mode, setMode, setMobileMenuOpen, mobileMenuOpen } =
    useContext<MainLayoutContextInterface>(MainLayoutContext);
  const { profile, logout } = useAuth();
  const { data: categoriesList } = useSWR(`/categories/getAll`, {
    dedupingInterval: 60 * 60 * 24,
  });
  const closeHandle = () => {
    if (setMobileMenuOpen) setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Modal
        open={mobileMenuOpen ? mobileMenuOpen : false}
        onClose={closeHandle}
      >
        <Slide direction="left" in={mobileMenuOpen} unmountOnExit>
          <ModalInner>
            <ModalMainHeadding>
              <Box>
                <IconButton
                  onClick={() => {
                    if (setMobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  size="small"
                  color="secondary"
                  sx={{
                    "& svg": {
                      color: "#fff",
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Box>
              <Box>TRUYENHOT.INFO</Box>
            </ModalMainHeadding>
            <Stack height={"100%"} p={1} pt={"50px"}>
              <Wrapper
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                  p: 2,
                  "& > div": {
                    "& a": {
                      textDecoration: "none",
                      color: "myText.primary",
                    },
                  },
                }}
              >
                {profile ? (
                  <>
                    <Box
                      sx={{
                        width: "70%",
                        textAlign: "center",
                        borderRight: "1px solid #eee",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {profile.result.email}
                    </Box>
                    <Box width={"30%"} textAlign={"center"}>
                      <Box
                        component={"p"}
                        m={0}
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => logout()}
                      >
                        Đăng xuất
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: "50%",
                        textAlign: "center",
                        borderRight: "1px solid #eee",
                      }}
                    >
                      <Link href={"/login?goAround=true"}>Đăng nhập</Link>
                    </Box>
                    <Box
                      sx={{
                        width: "50%",
                        textAlign: "center",
                      }}
                    >
                      <Link href={"/register?goAround=true"}>Đăng ký</Link>
                    </Box>
                  </>
                )}
              </Wrapper>

              <Wrapper justifyContent={"space-between"} alignItems={"center"}>
                <Box component={"span"}>Giao diện tối</Box>
                <Switch
                  checked={mode === "dark" ? true : false}
                  color="primary"
                  onClick={() => {
                    if (setMode) setMode(mode === "light" ? "dark" : "light");
                  }}
                />
              </Wrapper>
              <Wrapper alignItems={"flex-start"}>
                <WrapperHeadding>Thể loại</WrapperHeadding>
                <Box
                  maxHeight={cateShow ? "unset" : "95px"}
                  overflow={cateShow ? "unset" : "hidden"}
                >
                  {categoriesList?.result.map((cate: CategoryInterface) => {
                    return (
                      <Chip
                        key={cate.cate_code}
                        label={cate.cate_title}
                        component={Link}
                        href={`/categories/${cate.cate_code}`}
                        clickable
                        sx={{
                          mr: 1,
                          mt: 1,
                          fontSize: "13px",
                        }}
                        onClick={() => {
                          if (setMobileMenuOpen) setMobileMenuOpen(false);
                        }}
                      />
                    );
                  })}
                </Box>
                <Stack
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  <Button type="button" onClick={() => setCateShow(!cateShow)}>
                    {cateShow ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </Button>
                </Stack>
              </Wrapper>
            </Stack>
          </ModalInner>
        </Slide>
      </Modal>
    </>
  );
};
