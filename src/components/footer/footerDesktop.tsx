import React from "react";
import { Box, Stack, Container, Typography, Chip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ClassIcon from "@mui/icons-material/Class";
import useSWR from "swr";
import { CategoryInterface } from "@/models/categories";
import Link from "next/link";

type Props = {};

export const FooterDesktop = (props: Props) => {
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
                <Typography sx={{ fontSize: ".9em" }}>
                  Website Truyện Hot - là trang đọc truyện chữ online hàng đầu
                  Việt Nam với nhiều thể loại truyện đam mỹ, truyện ngôn tình,
                  truyện sắc chọn lọc dành cho độc giả yêu thích. <br />
                  <br /> Truyện hot luôn cập nhật những bộ truyện mới nhất, với
                  tốc độ nhanh nhất, chúc các bạn có trải nghiệm vui vẻ!
                  <br />
                  <br />
                  Liên hệ quảng cáo: 0978.481.071 | 0966.982.720
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
