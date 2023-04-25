import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { StoryMain, StorySidebar } from "@/components/stories";
import { MainLayoutContext } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import { StorySection } from "@/sections";
import { Container } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { API } from "@/utils/config";

type Props = {
  story: StoryInterface;
};

const StoryDetail = ({ story }: Props) => {
  const router = useRouter();
  const { isFallback } = router;
  const { setLoading } = useContext<any>(MainLayoutContext);

  useEffect(() => {
    setLoading(isFallback);
  }, [isFallback]);

  const viewIncrease = async () => {
    try {
      await API.get(`/stories/viewIncrease/${story.story_code}`);
    } catch (error) {}
  };

  useEffect(() => {
    viewIncrease();
  }, []);

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
      <MainBreadcrumbs links={breadCrumbs} />
      <StorySection>
        <Container
          maxWidth={"md"}
          sx={{
            m: "auto!important",
          }}
        >
          <Stack
            direction={"row"}
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
              width={"30%"}
              display={{
                xs: "none",
                md: "block",
              }}
            >
              <StorySidebar story={story} />
            </Box>
          </Stack>
        </Container>
      </StorySection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("http://localhost:5000/api/stories/getAll");
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

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  if (!context.params) return { notFound: true };
  const story_code = context.params.story_code;
  const respone = await fetch(
    `http://localhost:5000/api/stories/getDetail/${story_code}`
  );
  const story = await respone.json();
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
    },
    revalidate: 5,
  };
};

export default StoryDetail;
