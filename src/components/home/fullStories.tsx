import { CategoryInterface } from "@/models/categories";
import { FullStoriesInterface, HotStoriesInterface } from "@/models/home";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import Carousel from "better-react-carousel";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { IndexStoryCarouselLoading } from "../loading";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

type Props = {
  categories: CategoryInterface[];
};
export const HomeFullStories = ({ categories }: Props) => {
  const [cateValue, setCateValue] = useState<
    | {
        value: string;
        children: string;
      }
    | null
    | undefined
  >(null);
  const {
    data: hotStoriesList,
    mutate: hotStoriesListMutate,
    isValidating: hotStoriesValidating,
  } = useSWR(
    `/stories/getFullStories${cateValue ? "?category=" + cateValue.value : ""}`,
    {
      keepPreviousData: true,
    }
  );
  const carouselPreRender = () => {
    const result = [];
    for (let i = 0; i < 28; i++) {
      result.push(
        <Carousel.Item key={i}>
          <IndexStoryCarouselLoading key={i} />
        </Carousel.Item>
      );
    }
    return result;
  };

  const handleChange = (
    event: SelectChangeEvent,
    child?: { props: { value: string; children: string } }
  ) => {
    setCateValue(child?.props);
  };
  return (
    <>
      <Stack
        direction={{
          md: "row",
          xs: "column",
        }}
        mt={4}
        alignItems={{
          md: "center",
          xs: "flex-start",
        }}
        gap={"10px"}
        justifyContent={"space-between"}
      >
        <Box component={"h2"} m={0}>
          Truyện đã hoàn thành
          <Box
            component={Button}
            p={".5px"}
            minWidth={"unset"}
            type={"button"}
            ml={1}
            onClick={() => hotStoriesListMutate()}
            disabled={hotStoriesValidating ? true : false}
          >
            {hotStoriesValidating ? (
              <CircularProgress size={"1.5em"} color="inherit" />
            ) : (
              <CachedIcon />
            )}
          </Box>
        </Box>
        <Box
          component={FormControl}
          width={{
            md: "200px",
            xs: "100%",
          }}
        >
          <InputLabel size="small">Tất cả</InputLabel>
          <Select
            size="small"
            value={cateValue ? cateValue.value : ""}
            onChange={(event: SelectChangeEvent, child: any) =>
              handleChange(event, child)
            }
            input={
              <OutlinedInput
                sx={{
                  bgcolor: "#fff",
                }}
                size="small"
                label="Tất cả"
              />
            }
            MenuProps={MenuProps}
          >
            <MenuItem key={"aqq1234"} value={""}>
              Tất cả
            </MenuItem>
            {categories?.map((cate: CategoryInterface) => (
              <MenuItem key={cate.cate_code} value={cate.cate_code}>
                {cate.cate_title}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
      <Box className={"hr"} my={2} />
      <Carousel
        mobileBreakpoint={100}
        cols={7}
        rows={4}
        gap={10}
        responsiveLayout={[
          {
            breakpoint: 900,
            cols: 6,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 800,
            cols: 5,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 700,
            cols: 4,
            rows: 4,
            gap: 10,
            loop: true,
          },

          {
            breakpoint: 600,
            cols: 3,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 400,
            cols: 2,
            rows: 4,
            gap: 10,
            loop: true,
          },
        ]}
      >
        {hotStoriesValidating
          ? carouselPreRender()
          : hotStoriesList?.result.map((story: FullStoriesInterface) => {
              return (
                <Carousel.Item key={story._id}>
                  <Box
                    component={Link}
                    href={`/story/${story.story_code}`}
                    width={"100%"}
                    p={0}
                    m={0}
                    position={"relative"}
                    height={"180px"}
                    display={"block"}
                  >
                    <Box
                      component={"img"}
                      width="100%"
                      height={"180px"}
                      src={story.story_cover}
                      sx={{
                        objectFit: "cover",
                      }}
                      alt={story.story_title}
                    />
                    <Box
                      width={"100%"}
                      height={"auto"}
                      position={"absolute"}
                      display={"block"}
                      bottom={0}
                      left={0}
                      p={"4px"}
                      fontSize={".85em"}
                      bgcolor={"rgba(0,0,0, .4)"}
                      color={"primary.contrastText"}
                      sx={{
                        textShadow: "0 0 10px primary.main",
                      }}
                      maxHeight={"45px"}
                      overflow={"hidden"}
                      textAlign={"center"}
                    >
                      Full - {story._count.chapter} chương
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      textDecoration: "none",
                      fontSize: ".9em",
                      display: "block",
                      textAlign: "center",
                      color: "main.main",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, .05)",
                      maxHeight: "38px",
                      overflow: "hidden",
                    }}
                    component={Link}
                    href={`/story/${story.story_code}`}
                  >
                    {story.story_title.length > 30
                      ? story.story_title.substring(0, 26) + " ..."
                      : story.story_title}
                  </Box>
                </Carousel.Item>
              );
            })}
      </Carousel>
    </>
  );
};
