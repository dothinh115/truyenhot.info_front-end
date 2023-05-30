import { MainBreadcrumbs } from "@/components/breadcrumbs/mainBreadcrumbs";
import { Seo } from "@/components/seo";
import SameAuthorSidebar from "@/components/sidebar/sameAuthor";
import { StorySidebar } from "@/components/stories/sidebar";
import { CategoryInterface } from "@/models/categories";
import { StoriesSearchResultInterface } from "@/models/search";
import { StoryInterface } from "@/models/stories";
import { StorySection } from "@/sections";
import { API, apiURL } from "@/utils/config";
import { thumbnailUrl } from "@/utils/variables";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
type Props = {
  story: StoryInterface;
  categories: CategoryInterface[];
  sameAuthor: StoriesSearchResultInterface[];
};

const CategoriesSidebar = dynamic(
  () => import("../../../components/sidebar/categories")
);
const StoryMain = dynamic(() => import("../../../components/stories/main"));

const StoryDetail = ({ story, categories, sameAuthor }: Props) => {
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
    <Box
      component={Link}
      key="2"
      color="inherit"
      href={`/story/${story?.story_code}`}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
      sx={{
        textDecoration: "none",
      }}
    >
      {story?.story_title}
    </Box>,
  ];
  return (
    <>
      <Seo
        data={{
          title: `${story?.story_title} - truyenhot.info`,
          description: `${story?.story_title} - Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info/story/${story?.story_code}`,
          thumbnailUrl,
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
            <Box width={{ md: "30%", xs: "100%" }}>
              <StorySidebar>
                <SameAuthorSidebar sameAuthor={sameAuthor} />
                <Box display={{ md: "block", xs: "none" }}>
                  <CategoriesSidebar categories={categories} />
                </Box>
              </StorySidebar>
            </Box>
          </Stack>
        </Container>
      </StorySection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${apiURL}/api/stories/getAll?limit=6000`);
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
  if (!story.result) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const sameAuthorStoriesResponse = await fetch(
    `${apiURL}/api/search/storyAuthorQuickSearch?keywords=${story?.result.story_author}`
  );
  let sameAuthorStories = await sameAuthorStoriesResponse.json();
  sameAuthorStories = sameAuthorStories.result.filter(
    (item: StoriesSearchResultInterface) => item.story_code !== story_code
  );
  const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
  const categories = await categoriesResponse.json();

  return {
    props: {
      story: story.result,
      categories: categories.result,
      sameAuthor: sameAuthorStories,
    },
    revalidate: 60,
  };
};

export default StoryDetail;
