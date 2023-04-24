import { CategoryInterface } from "@/models/categories";
import { StoryInterface } from "@/models/stories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, List, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { Box, Stack, ListItemIcon } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ChapterDataInterface } from "@/models/chapters";
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
  }, [page]);

  useEffect(() => {
    if (story_code) chapterListMutate();
  }, [story_code]);

  useEffect(() => {
    if (story?.story_description)
      story.story_description = story.story_description
        .replaceAll("<div text-align: justify; >", "")
        .replaceAll("</div>", "");
  }, [story?.story_description]);
  return (
    <>
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
              },
              "& p, & a, & h4": {
                fontSize: "13px",
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
              height={600}
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
                showFirstButton={true}
                showLastButton={true}
                siblingCount={2}
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
