import { Typography } from "@mui/material";
import { Stack, Box } from "@mui/system";
import React from "react";
import { Block } from "../block";
import StarIcon from "@mui/icons-material/Star";

type Props = {};

export const StoryMain = (props: Props) => {
  return (
    <>
      <Block>
        <Stack direction={"row"} spacing={2} p={1}>
          <Stack spacing={2} width={"35%"}>
            <Box
              component={"img"}
              width={"100%"}
              src="https://img.dtruyen.com/public/images/large/vancothande1AoD5YHIGS.jpg"
              sx={{
                objectFit: "cover",
              }}
            />
            <Typography>
              Tác giả: <span>sidebar</span>
            </Typography>
            <Typography>
              Thể loại: <span>abc</span>
            </Typography>
            <Typography>
              Nguồn: <span>abc</span>
            </Typography>
            <Typography>
              Trạng thái: <span>abc</span>
            </Typography>
          </Stack>
          <Stack spacing={2} width={"65%"}>
            <Box
              component={"h1"}
              color={"#512da8"}
              textAlign={"center"}
              fontSize={25}
              my={1}
            >
              TIÊU ĐỀ TRUYỆN
            </Box>
            <Box
              sx={{
                mt: 0 + "!important",
                textAlign: "center",
              }}
            >
              <StarIcon sx={{ color: "#c0ca33" }} />
              <StarIcon sx={{ color: "#c0ca33" }} />
              <StarIcon sx={{ color: "#c0ca33" }} />
              <StarIcon sx={{ color: "#c0ca33" }} />
              <StarIcon />
            </Box>
            <Box
              sx={{
                mt: 0 + "!important",
              }}
            >
              <Typography py={2}>
                Bạn đang đọc truyện Vạn Cổ Thần Đế của tác giả Phi Thiên Ngư
                diễn ra vào thời điểm 800 năm trước, Minh Đế chi tử Trương Nhược
                Trần, bị vị hôn thê của hắn Trì Dao công chúa giết chết, thiên
                kiêu một đời, liền như vậy ngã xuống. Tám trăm năm sau, Trương
                Nhược Trần một lần nữa sống lại trong truyện tiên hiệp hot, lại
                phát hiện vị hôn thê đã từng giết chết hắn, đã thống nhất Côn
                Lôn Giới, mở ra Đệ Nhất Trung Ương đế quốc, được xưng "Trì Dao
                Nữ Hoàng" .
                <br />
                <br />
                Trì Dao Nữ Hoàng —— thống ngự thiên hạ, uy lâm bát phương; thanh
                xuân mãi mãi, bất tử bất diệt. Trương Nhược Trần đứng ở Chư
                Hoàng Từ Đường ở ngoài, nhìn Trì Dao Nữ Hoàng tượng thần, trong
                lòng bốc cháy lên hừng hực cừu hận liệt diễm, "Đợi ta trùng tu
                mười ba năm, dám gọi Nữ Hoàng dưới Hoàng Tuyền". Mời bạn cùng
                đọc truyện và thưởng thức truyện xuyên không hay nhất khá thú vị
                này.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Block>
    </>
  );
};
