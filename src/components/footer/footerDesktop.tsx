import React from "react";
import { Box, Stack, Container, Typography } from "@mui/material";

type Props = {};

export const FooterDesktop = (props: Props) => {
  return (
    <Box
      display={{
        md: "block",
        sm: "none",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"center"}
        bgcolor={"#7986cb"}
        color={"#fff"}
        sx={{
          borderTop: "1px solid #283593",
        }}
      >
        <Container maxWidth={"md"}>
          <Stack
            direction={"row"}
            spacing={2}
            minHeight={"150px"}
            alignItems={"center"}
          >
            <Box width={"50%"}>
              <Typography>
                Website Truyện Hot - là trang đọc truyện chữ online hàng đầu
                Việt Nam với nhiều thể loại truyện đam mỹ, truyện ngôn tình,
                truyện sắc chọn lọc dành cho độc giả yêu thích.
              </Typography>
            </Box>
            <Box width={"50%"}>Chứa các tags</Box>
          </Stack>
        </Container>
      </Stack>
    </Box>
  );
};
