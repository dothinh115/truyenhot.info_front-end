import { CategoryInterface } from "@/models/categories";
import { StoryInterface } from "@/models/stories";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Link from "next/link";
import { useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

type Props = {
  story: StoryInterface;
};

export const StoryMain = ({ story }: Props) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <Box>
      <Box component={"h1"} fontSize={20}>
        THÔNG TIN TRUYỆN
      </Box>
      <Box className={"hr"} />
      <Box component={"h1"} textAlign={"center"}>
        {story?.story_title}
      </Box>
      <Box textAlign={"center"}>
        <Box component={"img"} src={story?.story_cover} width={215} />
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
              {story?.story_author}
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Thể loại:</Box>
            <Box component={"ul"}>
              {story?.story_category.map((cate: CategoryInterface) => {
                return (
                  <Box component={"li"} key={cate.cate_id}>
                    <Box component={Link} href="/">
                      {cate.cate_title}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Nguồn:</Box>
            <Typography>{story?.story_source}</Typography>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>Trạng thái:</Box>
            <Box component={Link} href={"/"}>
              {story?.story_status}
            </Box>
          </Box>
        </Box>
      </Stack>
      <Box className={"hr"}></Box>
      <Box
        sx={{
          my: 2,
          fontSize: "14px",
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              story?.story_description.length >= 400
                ? showMore
                  ? story?.story_description
                  : story?.story_description.substring(0, 400) + "..."
                : story?.story_description,
          }}
        ></div>
      </Box>

      <Box textAlign={"right"} my={2}>
        <Button
          type="button"
          variant="contained"
          color="info"
          onClick={() => setShowMore(!showMore)}
          size="small"
        >
          {showMore ? "Rút gọn" : "Xem thêm"}
        </Button>
      </Box>

      <Box component={"h1"} fontSize={20}>
        DANH SÁCH CHƯƠNG
      </Box>
      <Box className={"hr"} />
      <Box
        component={"ul"}
        sx={{
          p: 0,
          "& > li": {
            listStyleType: "none",
            width: "50%",
            display: "inline-block",
            "& a": {
              textDecoration: "none",
              p: 0,
              display: "block",
            },
            "& svg": {
              color: "#0288d1",
            },
          },
        }}
      >
        <Box component={"li"}>
          <Stack direction={"row"}>
            <ArrowCircleRightIcon />
            <Box component={Link} href={"/"}>
              Chương 1
            </Box>
          </Stack>
        </Box>
        <Box component={"li"}>
          <Stack direction={"row"}>
            <ArrowCircleRightIcon />
            <Box component={Link} href={"/"}>
              Chương 2
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};
