import { CategoryInterface } from "@/models/categories";
import { Box, Button, Chip, Stack, IconButton } from "@mui/material";
import Link from "next/link";
import useSWR from "swr";
import { useContext, useState, useRef, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MainLayoutContext } from "@/layouts";
type Props = {
  open: boolean;
  setMobileMenuOpen: (arg0: boolean) => void;
};

export const Drawer = ({ open, setMobileMenuOpen }: Props) => {
  const [cateShow, setCateShow] = useState<boolean>(false);

  const { data: categoriesList } = useSWR(`/categories/getAll`, {
    dedupingInterval: 60 * 60 * 24,
  });
  const { setNavitionValue } = useContext<any>(MainLayoutContext);

  return (
    <>
      <Box
        position={"fixed"}
        zIndex={50}
        width={"100%"}
        height={"100%"}
        bgcolor={"#fff"}
        p={0}
        maxHeight={"100vh"}
        overflow={"auto"}
        left={open ? "0" : "100%"}
        sx={{
          transition: "left .2s ease",
        }}
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
                setNavitionValue("");
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
          <Box>TRUYENFULL.INFO</Box>
        </Stack>
        <Stack height={"100%"} p={1} pt={"50px"}>
          <Box component={"h3"}>Thể loại</Box>
          <Box className={"hr"} my={2} />
          <Box
            my={2}
            maxHeight={cateShow ? "unset" : "80px"}
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
                  onClick={() => setMobileMenuOpen(false)}
                />
              );
            })}
          </Box>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button type="button" onClick={() => setCateShow(!cateShow)}>
              {cateShow ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </Stack>

          <Box className={"hr"} my={2} />
        </Stack>
      </Box>
    </>
  );
};
