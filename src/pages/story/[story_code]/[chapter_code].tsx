import { ChapterSection } from "@/sections";
import React from "react";
import { Stack, Container, Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ChapterDataInterface, ChapterListInterface } from "@/models/chapters";
import Link from "next/link";
type Props = {
  chapterData: ChapterDataInterface;
};

const ChapterDetail = ({ chapterData }: Props) => {
  return (
    <>
      <ChapterSection>
        <Stack direction={"row"} justifyContent={"center"}>
          <Container maxWidth={"md"}>
            <Box
              component={"h1"}
              textAlign={"center"}
              color={"#3949ab"}
              fontWeight={"light"}
              fontSize={40}
              my={1}
            >
              {chapterData?.story.story_title}
            </Box>
            <Typography
              textAlign={"center"}
              fontWeight={"light"}
              fontSize={18}
              fontStyle={"italic"}
            >
              --- {chapterData?.chapter_name} ---
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              spacing={1}
              my={2}
            >
              <Button
                component={Link}
                href={`/story/${chapterData?.story_code}/${chapterData?.prevChapter}`}
                color="info"
                variant="contained"
                disabled={!chapterData?.prevChapter ? true : false}
              >
                <ArrowBackIcon />
                Chương trước
              </Button>
              <Button color="info" variant="contained">
                <MenuBookIcon />
                <Box component={"div"} sx={{}}>
                  abc
                </Box>
              </Button>
              <Button
                component={Link}
                href={`/story/${chapterData?.story_code}/${chapterData?.nextChapter}`}
                color="info"
                variant="contained"
                disabled={!chapterData?.nextChapter ? true : false}
              >
                Chương sau
                <ArrowForwardIcon />
              </Button>
            </Stack>
            <Box className={"hr"} my={4} />
            <Box
              component={"div"}
              fontSize={24}
              dangerouslySetInnerHTML={{
                __html: chapterData?.chapter_content,
              }}
            ></Box>
            <Box className={"hr"} my={4} />
            <Stack
              direction={"row"}
              justifyContent={"center"}
              spacing={1}
              my={2}
            >
              <Button color="info" variant="contained">
                <ArrowBackIcon />
                Chương trước
              </Button>
              <Button color="info" variant="contained">
                <MenuBookIcon />
              </Button>
              <Button color="info" variant="contained">
                Chương sau
                <ArrowForwardIcon />
              </Button>
            </Stack>
          </Container>
        </Stack>
      </ChapterSection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    "http://localhost:5000/api/chapter/getAllChapterList"
  );
  const data = await response.json();
  const paths = data.result.map((item: ChapterListInterface) => ({
    params: {
      story_code: item.story_code,
      chapter_code: item.chapter_code,
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
  const chapter_code = context.params.chapter_code;
  const revalidate = 60 * 60 * 24;
  const respone = await fetch(
    `http://localhost:5000/api/chapter/getChapterDataByStoryCode/${story_code}/${chapter_code}`
  );
  const chapter = await respone.json();
  if (!chapter.result) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      chapterData: chapter.result,
    },
    revalidate,
  };
};

export default ChapterDetail;
