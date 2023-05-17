import { MainLayoutContext } from "@/layouts";
import { CategoryInterface } from "@/models/categories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Divider,
  alpha,
} from "@mui/material";
import Link from "next/link";
import { useState, useContext } from "react";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import useSWR from "swr";

type Props = {
  open: boolean;
  setMobileMenuOpen: (arg0: boolean) => void;
};

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
}));

export const Drawer = ({ open, setMobileMenuOpen }: Props) => {
  const [cateShow, setCateShow] = useState<boolean>(false);
  const { mode, setMode } = useContext<any>(MainLayoutContext);
  const { data: categoriesList } = useSWR(`/categories/getAll`, {
    dedupingInterval: 60 * 60 * 24,
  });
  return (
    <>
      <Box
        position={"fixed"}
        zIndex={100}
        width={"100%"}
        height={"100%"}
        bgcolor={"myBackground.default"}
        p={0}
        maxHeight={"100vh"}
        overflow={"auto"}
        left={open ? "0" : "100%"}
        sx={{
          transition: "left .2s ease",
        }}
        top={0}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          component={"h2"}
          m={0}
          color={"rgba(255, 255, 255, 0.9)"}
          bgcolor={"#7986cb"}
          p={1}
          position={"absolute"}
          top={0}
          left={0}
          width={"100%"}
          zIndex={100}
        >
          <Box>
            <IconButton
              onClick={() => {
                setMobileMenuOpen(false);
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
        </Stack>
        <Stack height={"100%"} p={1} pt={"50px"}>
          <Wrapper justifyContent={"space-between"} alignItems={"center"}>
            <Box component={"span"}>Giao diện tối</Box>
            <Switch
              checked={mode === "dark" ? true : false}
              color="primary"
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
            />
          </Wrapper>
          <Wrapper alignItems={"flex-start"}>
            <Box
              maxHeight={cateShow ? "unset" : "95px"}
              overflow={cateShow ? "unset" : "hidden"}
            >
              <WrapperHeadding>Thể loại</WrapperHeadding>
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
                    onClick={() => setMobileMenuOpen(false)}
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
      </Box>
    </>
  );
};
