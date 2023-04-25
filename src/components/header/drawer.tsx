import React from "react";
import { Box, Button, Chip, Stack } from "@mui/material";
import useSWR from "swr";
import Link from "next/link";
import { CategoryInterface } from "@/models/categories";
type Props = {
  open: boolean;
  setMobileMenuOpen: (arg0: boolean) => void;
};

export const Drawer = ({ open, setMobileMenuOpen }: Props) => {
  const { data: categoriesList } = useSWR("/categories/getAll", {
    dedupingInterval: 60 * 60 * 24,
  });

  return (
    <>
      <Box
        position={"fixed"}
        width={"100%"}
        height={"100%"}
        bgcolor={"rgba(0,0,0,.65)"}
        zIndex={50}
        display={open ? "block" : "none"}
        onClick={() => setMobileMenuOpen(false)}
      ></Box>
      <Box
        position={"fixed"}
        zIndex={100}
        width={"85%"}
        height={"100%"}
        bgcolor={"#fff"}
        p={1}
        maxHeight={"100vh"}
        left={open ? "15%" : "100%"}
        sx={{
          transition: "left .2s ease",
        }}
      >
        <Box component={"h2"} m={0} color={"rgba(0, 0, 0, 0.6)"}>
          TRUYENFULL.INFO
        </Box>

        <Box component={"h3"}>Thể loại</Box>
        <Box className={"hr"} my={2} />
        <Box my={2}>
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
                }}
                onClick={() => setMobileMenuOpen(false)}
              />
            );
          })}
        </Box>
        <Box className={"hr"} my={2} />
        <Box>
          <Button
            type={"button"}
            color={"error"}
            variant="contained"
            fullWidth
            onClick={() => setMobileMenuOpen(false)}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </>
  );
};
