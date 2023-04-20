import { StoryMain, StorySidebar } from "@/components/stories";
import { StoryInterface } from "@/models/stories";
import { StorySection } from "@/sections";
import { Container } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React from "react";

type Props = {
  story: StoryInterface;
};

const StoryDetail = ({ story }: Props) => {
  return (
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
          <Box width={"70%"}>
            <StoryMain story={story} />
          </Box>
          <Box width={"30%"}>
            <StorySidebar />
          </Box>
        </Stack>
      </Container>
    </StorySection>
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

export const getStaticProps: GetStaticProps<Props> = async (
  context: GetStaticPropsContext
) => {
  if (!context.params) return { notFound: true };
  const story_code = context.params.story_code;
  const respone = await fetch(
    `http://localhost:5000/api/stories/getDetail/${story_code}`
  );
  const story = await respone.json();
  if (!story.result) return { notFound: true };
  return {
    props: {
      story: story.result,
    },
    revalidate: 5,
  };
};

export default StoryDetail;
