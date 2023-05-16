import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { StoryChapterPicker, StoryReportButton } from "@/components/stories";
import { ChapterDataInterface, ChapterListInterface } from "@/models/chapters";
import { ChapterSection } from "@/sections";
import { apiURL } from "@/utils/config";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
type Props = {
  chapterData: ChapterDataInterface;
};

const ChapterTitle = styled("h1")(({ theme }) => ({
  textAlign: "center",
  color: "#606fc3",
  margin: "0",
  textShadow: "0px 1px 1px rgba(255, 255, 255, .2)",
  [theme.breakpoints.up("xs")]: {
    fontWeight: "medium",
    fontSize: "20px",
  },
  [theme.breakpoints.up("md")]: {
    fontWeight: "light",
    fontSize: "30px",
  },
}));

const ChapterName = styled("h2")(({ theme }) => ({
  textAlign: "center",
  margin: "0",
  color: theme.palette.myText.primary,
  fontWeight: "500",
  fontSize: "1em",
}));

const ChapterContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    fontSize: "18px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "24px",
  },
  lineHeight: "2",
  "& img": {
    maxWidth: "100%",
    margin: "auto",
    display: "block",
  },
  color: theme.palette.myText.secondary,
}));

const ChapterDetail = ({ chapterData }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: chapterListData, mutate: chapterListMutate } = useSWR<{
    result: ChapterListInterface[];
  }>(`/chapter/getChapterListByStoryCode/${chapterData?.story_code}?page=all`, {
    revalidateOnMount: false,
  });

  useEffect(() => {
    if (chapterData) {
      const getData = localStorage.getItem("readingStories");
      let readingStories = [];
      if (getData) readingStories = JSON.parse(getData);
      const data = {
        story_title: chapterData?.story_title,
        story_code: chapterData?.story_code,
        chapter_code: chapterData?.chapter_code,
        chapter_name: chapterData?.chapter_name,
      };

      const findIndex = readingStories.findIndex(
        (story: any) => story.story_code === chapterData?.story_code
      );
      if (findIndex !== -1) {
        readingStories = readingStories.filter(
          (item: any) => item.story_code !== chapterData?.story_code
        );
        readingStories = [data, ...readingStories];
      } else readingStories = [data, ...readingStories];
      if (readingStories.length > 5)
        readingStories = readingStories.slice(0, 5);
      localStorage.setItem("readingStories", JSON.stringify(readingStories));
    }
  }, [chapterData]);

  useEffect(() => {
    if (chapterData?.story_code) chapterListMutate();
  }, [chapterData?.story_code]);

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
      href={`/story/${chapterData?.story_code}`}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
      sx={{
        textDecoration: "none",
      }}
    >
      {chapterData?.story_title}
    </Box>,
    <Box
      component={"span"}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
      key="3"
    >
      {chapterData?.chapter_name}
    </Box>,
  ];

  return (
    <>
      <Seo
        data={{
          title: `Truyện ${chapterData?.story_title} - ${
            chapterData?.chapter_name
          }${
            chapterData?.chapter_title ? `: ${chapterData?.chapter_title}` : ""
          } || Truyện Hot || truyenhot.info`,
          description: `Bạn đang đọc truyện ${chapterData?.story_title} ${
            chapterData?.chapter_name
          }${
            chapterData?.chapter_title ? `: ${chapterData?.chapter_title}` : ""
          } : ${chapterData?.chapter_content.substring(0, 320)}`,
          url: `https//truyenhot.info/story/${chapterData?.story_code}/${chapterData?.chapter_code}`,
          thumbnailUrl: `${apiURL}/api/public/images/thumnail/thumbnail.jpg`,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <ChapterSection>
        <Stack direction={"row"} justifyContent={"center"}>
          <Container maxWidth={"md"}>
            <ChapterTitle>{chapterData?.story_title}</ChapterTitle>
            <ChapterName>{chapterData?.chapter_title}</ChapterName>

            <StoryChapterPicker
              chapterData={chapterData}
              chapterListData={
                chapterListData?.result ? chapterListData?.result : []
              }
            />

            <Box textAlign={"center"}>
              <StoryReportButton
                open={open}
                setOpen={setOpen}
                story_code={chapterData?.story_code}
              />
            </Box>
            <Box className={"hr"} my={4} />

            <ChapterContent
              dangerouslySetInnerHTML={{
                __html: chapterData?.chapter_content,
              }}
            ></ChapterContent>

            <Box className={"hr"} my={4} />
            <Box textAlign={"center"}>
              <StoryReportButton
                open={open}
                setOpen={setOpen}
                story_code={chapterData?.story_code}
              />
            </Box>
            <StoryChapterPicker
              chapterData={chapterData}
              chapterListData={
                chapterListData?.result ? chapterListData?.result : []
              }
            />
          </Container>
        </Stack>
      </ChapterSection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${apiURL}/api/chapter/getAllChapterList`);
  const data = await response.json();
  const paths = data.result?.map((item: ChapterListInterface) => ({
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
  const revalidate = 5;
  const respone = await fetch(
    `${apiURL}/api/chapter/getChapterDataByStoryCode/${story_code}/${chapter_code}`
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
