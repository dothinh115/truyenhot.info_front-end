import { CategoryInterface } from "@/models/categories";
import { ChapterDataInterface } from "@/models/chapters";
import { StoryInterface } from "@/models/stories";
import { timeSince } from "@/utils/function";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  Button,
  List,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
type Props = {
  story: StoryInterface;
};

export const StoryMain = ({ story }: Props) => {
  const router = useRouter();
  const { story_code, page } = router?.query;
  const [paginationPage, setPaginationPage] = useState<number>(1);

  const { data: chapterListData, mutate: chapterListMutate } = useSWR(
    `/chapter/getChapterListByStoryCode/${story_code}?page=${page ? page : 1}`,
    { revalidateOnMount: false }
  );
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    if (page) setPaginationPage(+page);
    if (story) chapterListMutate();
  }, [story, page]);

  useEffect(() => {
    if (story?.story_description)
      story.story_description = story.story_description
        .replaceAll("<div text-align: justify; >", "")
        .replaceAll("</div>", "");
  }, [story?.story_description]);

  return (
    <>
      <Box>
        <Box component={"h1"} fontSize={20} mt={0}>
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
              },
              "& p, & a, & h4, & li": {
                fontSize: "13px",
              },
              "& > li > h4": {
                my: 0,
              },
              "& > li": {
                lineHeight: "30px",
                "&:not(:last-child)": {
                  borderBottom: "1px dashed #ccc",
                },
              },
              "& > li > ul": {
                display: "inline-block",
                pl: 1,
              },
              "& span": {
                mr: 1,
                "&::after": {
                  content: '","',
                  display: "inline-block",
                  ml: "2px",
                },
              },
            }}
          >
            <Box component={"li"}>
              <Box component={"h4"}>Tác giả:</Box>
              <Box
                component={Link}
                href={`/search/author?keywords=${story?.story_author}`}
              >
                {story?.story_author}
              </Box>
            </Box>
            <Box component={"li"}>
              <Box component={"h4"}>Thể loại:</Box>

              {story?.story_category.map((cate: CategoryInterface) => {
                return (
                  <Box component={"span"} key={cate.cate_id}>
                    <Box
                      component={Link}
                      href={`/categories/${cate.cate_code}`}
                    >
                      {cate.cate_title}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box component={"li"}>
              <Box component={"h4"}>Nguồn:</Box>
              <Typography>{story?.story_source}</Typography>
            </Box>
            <Box component={"li"}>
              <Box component={"h4"}>Trạng thái:</Box>
              {story?.story_status}
            </Box>
            <Box component={"li"}>
              <Box component={"h4"}>Update lần cuối:</Box>
              {story?.updated_at &&
                timeSince(
                  Math.abs(
                    new Date().valueOf() - new Date(story?.updated_at).valueOf()
                  )
                )}{" "}
              trước
            </Box>
            <Box component={"li"}>
              <Box component={"h4"}>Lượt xem:</Box>
              {story?.story_view}
            </Box>
          </Box>
        </Stack>
        <Box className={"hr"}></Box>
        {story?.story_description && (
          <Box
            component={"div"}
            sx={{
              my: 2,
              fontSize: "13px",
            }}
            dangerouslySetInnerHTML={{
              __html:
                story?.story_description.length >= 400
                  ? showMore
                    ? story?.story_description
                    : story?.story_description.substring(0, 400) + "..."
                  : story?.story_description,
            }}
          ></Box>
        )}

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
        {chapterListData?.pagination && (
          <>
            <Box
              component={List}
              height={{
                md: 600,
                xs: "100%",
              }}
              overflow={"auto"}
              mt={3}
              bgcolor={"#fff"}
              dense={true}
            >
              {chapterListData?.result.map((data: ChapterDataInterface) => {
                return (
                  <ListItem
                    key={data.chapter_id}
                    sx={{
                      borderBottom: "1px dashed #ccc",
                    }}
                    dense={true}
                  >
                    <Box component={ListItemIcon} minWidth={"25px"}>
                      <ArrowCircleRightIcon />
                    </Box>
                    <ListItemButton
                      component={Link}
                      href={`/story/${story_code}/${data.chapter_code}`}
                      scroll={true}
                    >
                      <ListItemText
                        primary={`${data.chapter_name}${
                          data.chapter_title ? ": " + data.chapter_title : ""
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Box>
            <Stack direction={"row"} justifyContent={"center"} mt={2}>
              <Pagination
                count={chapterListData?.pagination.pages}
                page={paginationPage}
                color="primary"
                onChange={(e, p) =>
                  router.push(
                    {
                      pathname: router.pathname,
                      query: {
                        story_code,
                        page: p,
                      },
                    },
                    undefined,
                    { scroll: false }
                  )
                }
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </>
        )}
      </Box>
    </>
  );
};
