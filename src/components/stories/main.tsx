import { CategoryInterface } from "@/models/categories";
import { StoryInterface } from "@/models/stories";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Link from "next/link";

type Props = {
  story: StoryInterface;
};

export const StoryMain = ({ story }: Props) => {
  return (
    <Box>
      <Box component={"h1"} fontSize={20}>
        THÔNG TIN TRUYỆN
      </Box>
      <Box className={"hr"}></Box>
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
          mt: 2,
          fontSize: "14px",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: story?.story_description }}
        ></div>
      </Box>
    </Box>
  );
};
