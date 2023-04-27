import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { ChapterDataInterface, ChapterListInterface } from "@/models/chapters";
import { ChapterSection } from "@/sections";
import { API, apiURL } from "@/utils/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  chapterData: ChapterDataInterface;
};

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

const ChapterDetail = ({ chapterData }: Props) => {
  const [chapterListData, setChapterListData] = useState<any>();

  const router = useRouter();
  const handleChange = (event: SelectChangeEvent, child?: any) => {
    router.push({
      pathname: router.pathname,
      query: {
        chapter_code: child.props.value,
        story_code: chapterData?.story_code,
      },
    });
  };

  const getChapterListData = async () => {
    try {
      const result = await API.get(
        `/chapter/getChapterListByStoryCode/${chapterData?.story_code}?page=all`
      );
      setChapterListData(result);
    } catch (error) {}
  };

  useEffect(() => {
    if (chapterData?.story_code) getChapterListData();
  }, [router.query]);

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
      {chapterData?.story_title.length > 20
        ? chapterData?.story_title.substring(0, 19) + "..."
        : chapterData?.story_title}
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

  if (router.isFallback) return "...Loading";

  return (
    <>
      <Seo
        data={{
          title: `Truyện ${chapterData?.story_title} - ${
            chapterData?.chapter_name
          }${
            chapterData?.chapter_title ? `: ${chapterData?.chapter_title}` : ""
          } || Truyện Hot || Truyenhot.info`,
          description: `Bạn đang đọc truyện ${chapterData?.story_title} ${
            chapterData?.chapter_name
          }${
            chapterData?.chapter_title ? `: ${chapterData?.chapter_title}` : ""
          } : ${chapterData?.chapter_content}`,
          url: `https//truyenhot.info/story/${chapterData?.story_code}/${chapterData?.chapter_code}`,
          thumbnailUrl: ``,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <ChapterSection>
        <Stack direction={"row"} justifyContent={"center"}>
          <Container maxWidth={"md"}>
            <Box
              component={"h1"}
              textAlign={"center"}
              color={"#3949ab"}
              fontWeight={{
                md: "light",
                xs: "medium",
              }}
              fontSize={{
                md: "40px",
                xs: "30px",
              }}
              mb={4}
            >
              {chapterData?.story_title}
            </Box>

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
                size="small"
                disabled={!chapterData?.prevChapter ? true : false}
              >
                <ArrowBackIcon />
                <Typography
                  display={{
                    md: "block",
                    xs: "none",
                  }}
                >
                  Chương trước
                </Typography>
              </Button>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>Chọn chương</InputLabel>
                <Select
                  value={
                    chapterData?.chapter_code && chapterListData
                      ? chapterData?.chapter_code
                      : ""
                  }
                  onChange={(event, child) => handleChange(event, child)}
                  input={<OutlinedInput label="Chọn chương" />}
                  MenuProps={MenuProps}
                >
                  {chapterListData?.result.map((chapter: any) => (
                    <MenuItem
                      key={chapter.chapter_id}
                      value={chapter.chapter_code}
                    >
                      {chapter.chapter_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                component={Link}
                href={`/story/${chapterData?.story_code}/${chapterData?.nextChapter}`}
                color="info"
                variant="contained"
                size="small"
                disabled={!chapterData?.nextChapter ? true : false}
              >
                <Typography
                  display={{
                    md: "block",
                    xs: "none",
                  }}
                >
                  Chương sau
                </Typography>
                <ArrowForwardIcon />
              </Button>
            </Stack>
            <Box className={"hr"} my={4} />

            <Box
              component={"div"}
              fontSize={{
                md: "24px",
                xs: "18px",
              }}
              lineHeight={"2"}
              sx={{
                wordSpacing: ".3px",
                "& figure": {
                  textAlign: "center",
                },
              }}
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
              <Button
                component={Link}
                href={`/story/${chapterData?.story_code}/${chapterData?.prevChapter}`}
                color="info"
                variant="contained"
                size="small"
                disabled={!chapterData?.prevChapter ? true : false}
              >
                <ArrowBackIcon />
                <Typography
                  display={{
                    md: "block",
                    xs: "none",
                  }}
                >
                  Chương trước
                </Typography>
              </Button>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel>Chọn chương</InputLabel>
                <Select
                  value={
                    chapterData?.chapter_code && chapterListData
                      ? chapterData?.chapter_code
                      : ""
                  }
                  onChange={(event, child) => handleChange(event, child)}
                  input={<OutlinedInput label="Chọn chương" />}
                  MenuProps={MenuProps}
                >
                  {chapterListData?.result.map((chapter: any) => (
                    <MenuItem
                      key={chapter.chapter_id}
                      value={chapter.chapter_code}
                    >
                      {chapter.chapter_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                component={Link}
                href={`/story/${chapterData?.story_code}/${chapterData?.nextChapter}`}
                color="info"
                variant="contained"
                size="small"
                disabled={!chapterData?.nextChapter ? true : false}
              >
                <Typography
                  display={{
                    md: "block",
                    xs: "none",
                  }}
                >
                  Chương sau
                </Typography>
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
  const revalidate = 60 * 60 * 24;
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
