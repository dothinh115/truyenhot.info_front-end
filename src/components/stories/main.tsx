import { Typography } from "@mui/material";
import { Stack, Box } from "@mui/system";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
type Props = {};

export const StoryMain = (props: Props) => {
  return (
    <Box>
      <Box component={"h1"} fontSize={20}>
        THÔNG TIN TRUYỆN
      </Box>
      <Box className={"hr"}></Box>
      <Box component={"h1"} textAlign={"center"}>
        CÁ MẶN LÊN ĐỆ NHẤT THIÊN BẢNG
      </Box>
      <Box textAlign={"center"}>
        <Box
          component={"img"}
          src={
            "https://static.8cache.com/cover/eJzLyTDWT4lIMy9NKQuyzDX2TcqtCkv3iC8tcyxKzoi09AvJdXQqtgxJrwz0dffMMAvKryiJz3MN8PQvCa1IcjJJLMssCM9ITwuM1I2qyDDIcCxxK3Q1cLQtNzI01c0wNjICAFx4IHw=/ca-man-len-de-nhat-thien-bang.jpg"
          }
          width={215}
        />
      </Box>
      <Stack direction={"row"} justifyContent={"center"}>
        <FavoriteIcon
          sx={{
            color: "red",
            height: "25px",
            lineHeight: "25px",
            fontSize: "25px",
          }}
        />
        <Typography
          sx={{
            fontStyle: "italic",
            fontSize: "13px",
            height: "25px",
            lineHeight: "25px",
          }}
        >
          3000 lượt like
        </Typography>
      </Stack>
      <Stack>
        <Box
          component={"ul"}
          sx={{
            listStyleType: "none",
            pl: 0,
            "& a ": {
              textDecoration: "none",
              color: "#303f9f",
            },
            "& > li > a, & > li > h4, & > li > p": {
              display: "inline-block",
              marginRight: "5px",
              fontSize: "14px",
            },
            "& > li > h4": {
              my: 0,
            },
            "& > li": {
              height: "30px",
              lineHeight: "30px",
              "&:not(:last-child)": {
                borderBottom: "1px dashed #ccc",
              },
            },
            "& > li > ul": {
              display: "inline-block",
              pl: 1,
              "& > li": {
                listStyleType: "none",
                display: "inline-block",
                mr: 1,
                "&::after": {
                  content: '","',
                  display: "inline-block",
                  ml: "2px",
                },
              },
            },
          }}
        >
          <Box component={"li"}>
            <Box component={"h4"}>Tác giả:</Box>
            <Box component={Link} href={"/"}>
              Nhất Trì Thanh Hứa
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Thể loại:</Box>
            <Box component={"ul"}>
              <Box component={"li"}>
                <Box component={Link} href="/">
                  Tiên Hiệp
                </Box>
              </Box>
              <Box component={"li"}>
                <Box component={Link} href="/">
                  Ngôn Tình
                </Box>
              </Box>
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Nguồn:</Box>
            <Typography>Sưu tầm</Typography>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Trạng thái:</Box>
            <Box component={Link} href={"/"}>
              Đang update
            </Box>
          </Box>
        </Box>
      </Stack>
      <Box className={"hr"}></Box>
      <Typography
        sx={{
          mt: 2,
          fontSize: "14px",
        }}
      >
        Tác giả: Nhất Trì Thanh Hứa
        <br />
        <br />
        Thể loại: Xuyên Không, Hài Hước, Ngôn Tình, Truyện Nữ Cường, Cổ Đại,
        Tiên Hiệp, Truyện Sủng, Huyền Huyễn
        <br />
        <br />
        Giới thiệu:
        <br />
        <br />
        Ngu Tri Dao đã xuyên qua thành đại sư tỷ của Vân Kiếm Phái, được trang
        bị buff may mắn và có miễn phí ăn uống trong mười năm khi ở Thế giới Tu
        Chân. Tuy nhiên, từ một thiên tài của cấp bậc trên, nàng bỗng trở thành
        một phế cá mặn khiến cho chưởng môn trưởng lão cảm thấy tiếc nuối về sự
        mất đi của một thiên tài.
        <br />
        <br />
        Sau khi Vân Sinh tiên cảnh xuất hiện, danh sách Thiên bảng ra đời và Ngu
        Tri Dao nhanh chóng vươn lên đứng ở hạng nhất với năm người khác. Tuy
        nhiên, ấn tượng xấu của nàng là phế vật cá mặn vẫn bám theo nàng trong
        suốt hành trình, khiến các sư đệ sư muội của nàng muốn thách đấu với
        nàng và cả những đứa trẻ giữ cửa trong Vân Kiếm Phái cũng muốn đánh đổi
        vị trí trên Thiên bảng với nàng.
        <br />
        <br />
        Mặc dù cảm thấy lạc quan hơn sau khi gặp gỡ Lạc Vân Dã, một người cùng
        khổ cực với Ngu Tri Dao khi bị đánh rơi khỏi Vân Phù Phái, hai người
        cùng nhau trình diễn kỹ năng và tạo niềm vui cho mọi người. Trên đường
        đi, họ đụng đến các nơi khác như Yêu sơn và Huyễn sơn, và qua đó, Ngu
        Tri Dao đã giúp đỡ Lạc Vân Dã nhiều lần với vận may của mình.
        <br />
        <br />
        Cuối cùng, Ngu Tri Dao đã đạt được cấp bậc Thiên nhân cảnh trong Tu chân
        giới.
      </Typography>
    </Box>
  );
};
