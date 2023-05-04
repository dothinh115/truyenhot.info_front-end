import { RecentStoriesInterface } from "@/models/categories";
import { Box } from "@mui/material";
import Carousel from "better-react-carousel";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

type Props = {};

export const IndexCarousel = (props: Props) => {
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
    `/stories/getRecentUpdate${
      cateValue ? "?category=" + cateValue.value : ""
    }`,
    {
      keepPreviousData: true,
      refreshInterval: 10000,
    }
  );
  return (
    <>
      <Box component={"h2"} m={0}>
        Truyện hot
      </Box>
      <Box className={"hr"} my={2} />
      <Carousel
        mobileBreakpoint={100}
        cols={6}
        rows={2}
        gap={10}
        responsiveLayout={[
          {
            breakpoint: 600,
            cols: 4,
            rows: 2,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 800,
            cols: 5,
            rows: 2,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 500,
            cols: 2,
            rows: 2,
            gap: 10,
            loop: true,
          },
        ]}
      >
        {hotStoriesList?.result.map((story: RecentStoriesInterface) => {
          return (
            <Carousel.Item>
              <Box
                component={Link}
                href={`/story/${story.story_code}`}
                width={"100%"}
                p={0}
                m={0}
                position={"relative"}
                maxHeight={"180px"}
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
                >
                  {story.story_title}
                </Box>
              </Box>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </>
  );
};
