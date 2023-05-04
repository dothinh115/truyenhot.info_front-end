import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { CategoriesSidebar, SameAuthorSidebar } from "@/components/sidebar";
import { StoryMain, StorySidebar } from "@/components/stories";
import { CategoryInterface } from "@/models/categories";
import { StoriesSearchResultInterface } from "@/models/search";
import { StoryInterface } from "@/models/stories";
import { StorySection } from "@/sections";
import { API, apiURL } from "@/utils/config";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import { useEffect } from "react";
type Props = {
  story: StoryInterface;
  storiesSameAuthor: StoriesSearchResultInterface[];
  categories: CategoryInterface[];
};

const StoryDetail = ({ story, storiesSameAuthor, categories }: Props) => {
  useEffect(() => {
    if (story) {
      try {
        API.get(`/stories/viewIncrease/${story?.story_code}`);
      } catch (error) {}
    }
  }, [story]);
  const breadCrumbs = [
    <Box
      key={1}
      component={Link}
      href="/"
      display={"flex"}
      alignItems={"center"}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
    >
      <HomeIcon />
    </Box>,
    <Typography
      key="2"
      color="inherit"
      fontSize={{
        md: "1rem",
        xs: ".9rem",
      }}
      sx={{
        textDecoration: "none",
      }}
    >
      {story?.story_title.length > 30
        ? story?.story_title.substring(0, 29) + "..."
        : story?.story_title}
    </Typography>,
  ];
  return (
    <>
      <Seo
        data={{
          title: `${story?.story_title} - truyenhot.info`,
          description: `${story?.story_title} - Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info/story/${story?.story_code}`,
          thumbnailUrl: `${apiURL}/api/public/images/thumnail/thumbnail.jpg`,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <StorySection>
        <Container
          maxWidth={"md"}
          sx={{
            m: "auto!important",
          }}
        >
          <Stack
            direction={{
              md: "row",
              xs: "column",
            }}
            spacing={2}
            sx={{
              m: "auto!important",
            }}
          >
            <Box
              width={{
                xs: "100%",
                md: "70%",
              }}
            >
              <StoryMain story={story} />
            </Box>

            <Box
              display={{
                xs: "block",
                md: "none",
              }}
            >
              <Box className={"hr"} width={"100%"} my={3} />
              <SameAuthorSidebar storiesSameAuthor={storiesSameAuthor} />
            </Box>
            <Box
              width={"30%"}
              display={{
                xs: "none",
                md: "block",
              }}
            >
              <StorySidebar>
                <SameAuthorSidebar storiesSameAuthor={storiesSameAuthor} />
                <CategoriesSidebar categories={categories} />
              </StorySidebar>
            </Box>
          </Stack>
        </Container>
      </StorySection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${apiURL}/api/stories/getAll`);
  const data = await response.json();
  const paths = data.result.map((item: StoryInterface) => ({
    params: {
      story_code: item.story_code,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (
  context: GetStaticPropsContext
) => {
  if (!context.params) return { notFound: true };
  const story_code = context.params.story_code;
  const storyRespone = await fetch(
    `${apiURL}/api/stories/getDetail/${story_code}`
  );
  const story: { result: StoryInterface } = await storyRespone.json();
  const story_author = story.result?.story_author;

  const respone_2 = await fetch(
    `${apiURL}/api/search/storyAuthor?keywords=${story_author}&exact=true`
  );
  const storiesSameAuthorJson = await respone_2.json();
  const storiesSameAuthor: StoriesSearchResultInterface[] =
    storiesSameAuthorJson.result.filter(
      (item: StoriesSearchResultInterface) =>
        item.story_code !== story.result.story_code
    );
  const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
  const categories = await categoriesResponse.json();

  if (!story.result) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      story: story.result,
      storiesSameAuthor,
      categories: categories.result,
    },
    revalidate: 5,
  };
};

export default StoryDetail;
