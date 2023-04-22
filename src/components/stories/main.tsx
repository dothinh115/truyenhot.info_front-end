import { CategoryInterface } from "@/models/categories";
import { StoryInterface } from "@/models/stories";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Link from "next/link";
import { useContext, useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useSWR from "swr";
import Pagination from "@mui/material/Pagination";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PaginationItem from "@mui/material/PaginationItem";
import { MainLayoutContext } from "@/layouts";

type Props = {
  story: StoryInterface;
};

export const StoryMain = ({ story }: Props) => {
  const router = useRouter();
  const { isFallback } = router;
  const { story_code, page } = router?.query;
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const { setLoading } = useContext<any>(MainLayoutContext);

  const { data: chapterListData } = useSWR(
    `/chapter/getChapterListByStoryCode/${story_code}?page=${page ? page : 1}`
  );
  const [showMore, setShowMore] = useState<boolean>(false);
  useEffect(() => {
    setLoading(isFallback);
  }, [isFallback]);

  useEffect(() => {
    if (page) setPaginationPage(+page);
  }, [page]);
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
            minHeight: "290px",
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
          {chapterListData?.result.length === 0 && "Không có chương truyện nào"}
          {chapterListData?.result.map((chapter: any) => {
            return (
              <Box component={"li"} key={chapter.chapter_id} pl={4}>
                <Stack direction={"row"}>
                  <ArrowCircleRightIcon />
                  <Box
                    component={Link}
                    href={`/story/${chapter.story_code}/${chapter.chapter_code}`}
                  >
                    {chapter.chapter_name}
                    {chapter.chapter_title ? `: ${chapter.chapter_title}` : ""}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Box>
        {chapterListData?.pagination && (
          <Stack direction={"row"} justifyContent={"center"} mt={2}>
            <Pagination
              count={chapterListData?.pagination.pages}
              page={paginationPage}
              color="primary"
              showFirstButton={true}
              showLastButton={true}
              siblingCount={2}
              // onChange={(e, p) => router.push(`/story/${story_code}?page=${p}`)}
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
        )}
      </Box>
    </>
  );
};
