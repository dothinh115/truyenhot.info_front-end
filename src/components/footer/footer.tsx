import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import InfoIcon from "@mui/icons-material/Info";
import ClassIcon from "@mui/icons-material/Class";
import useSWR from "swr";
import { CategoryInterface } from "@/models/categories";
import Link from "next/link";

type Props = {};

export const Footer = (props: Props) => {
  const { data: categoriesList } = useSWR(`/categories/getAll`, {
    dedupingInterval: 60 * 60 * 24,
  });
  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        color={"#fff"}
        sx={{
          borderTop: "1px dashed #7986cba6",
        }}
      >
        <Box
          bgcolor={"#7986cb"}
          width={"100%"}
          m={"5px 5px 0 5px"}
          borderRadius={"10px 10px 0 0"}
        >
          <Container maxWidth={"md"}>
            <Stack
              direction={"row"}
              minHeight={"150px"}
              alignItems={"flex-start"}
              flexWrap={"wrap"}
            >
              <Box width={{ md: "50%", xs: "100%" }}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  component={"h3"}
                  my={1}
                  spacing={1}
                  pb={1}
                  borderBottom={"1px dashed #fff"}
                >
                  <InfoIcon />
                  <Box component={"span"}>Giới thiệu</Box>
                </Stack>
                <Typography
                  sx={{
                    fontSize: ".9em",
                    "& > a": {
                      color: "myText.footerLink",
                      textDecoration: "none",
                    },
                  }}
                >
                  Website Truyện Hot - là trang{" "}
                  <Link href={`/`} title="truyenhot.info">
                    đọc truyện
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    đọc truyện chữ
                  </Link>{" "}
                  online hàng đầu Việt Nam với nhiều thể loại{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện đam mỹ
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện ngôn tình
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện sắc
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện linh dị
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện xuyên không
                  </Link>
                  ,{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện trọng sinh
                  </Link>{" "}
                  chọn lọc dành cho độc giả yêu thích. <br />
                  <br /> Truyện hot luôn cập nhật những bộ{" "}
                  <Link href={`/`} title="truyenhot.info">
                    truyện mới nhất
                  </Link>
                  , với tốc độ nhanh nhất, chúc các bạn có trải nghiệm vui vẻ!
                </Typography>
              </Box>

              <Box width={{ md: "50%", xs: "100%" }} m={0}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  component={"h3"}
                  my={1}
                  spacing={1}
                  pb={1}
                  borderBottom={"1px dashed #fff"}
                >
                  <ClassIcon />
                  <Box component={"span"}>Thể loại</Box>
                </Stack>
                {categoriesList?.result.map((cate: CategoryInterface) => {
                  return (
                    <Chip
                      component={Link}
                      href={`/categories/${cate.cate_code}`}
                      key={cate._id}
                      label={cate.cate_title}
                      size="small"
                      variant="outlined"
                      color="primary"
                      title={cate.cate_title}
                      sx={{
                        mr: "4px",
                        mb: "4px",
                        bgcolor: "rgba(255, 255, 255, .85)",
                        cursor: "pointer",
                        "& > span": {
                          color: "#757575",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Stack>
          </Container>
        </Box>
      </Stack>
    </Box>
  );
};
