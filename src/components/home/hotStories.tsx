import { CategoryInterface } from "@/models/categories";
import { HotStoriesInterface } from "@/models/home";
import CachedIcon from "@mui/icons-material/Cached";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled, alpha } from "@mui/material/styles";
import Carousel from "better-react-carousel";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { HotStoriesLoading } from "../loading/storyCarouselLoading";
const BoxWrapper = styled(Link)(() => ({
  width: "100%",
  padding: 0,
  margin: 0,
  position: "relative",
  height: "180px",
  display: "block",
  borderRadius: "5px",
  overflow: "hidden",
}));

const BoxTitle = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "auto",
  position: "absolute",
  display: "block",
  bottom: 0,
  left: 0,
  padding: "4px",
  fontSize: ".85em",
  backgroundColor: alpha(theme.palette.myBackground.imgFooter, 0.8),
  color: theme.palette.myText.main,
  textShadow: "0 0 10px myPrimary.main",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  letterSpacing: "-1px",
}));

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

const HomeHotStories = ({ categories }: Props) => {
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
    `/stories/getHotStories${cateValue ? "?category=" + cateValue.value : ""}`,
    {
      keepPreviousData: true,
    }
  );

  const carouselPreRender = () => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      result.push(
        <Carousel.Item key={i}>
          <HotStoriesLoading key={i} />
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
        alignItems={{
          md: "center",
          xs: "flex-start",
        }}
        gap={"10px"}
        justifyContent={"space-between"}
      >
        <Box
          component={"h2"}
          m={0}
          sx={{
            color: "myText.primary",
            textTransform: "uppercase",
          }}
        >
          Truyện hot
          <Box
            component={Button}
            p={".5px"}
            minWidth={"unset"}
            type={"button"}
            ml={1}
            onClick={() => hotStoriesListMutate()}
            disabled={hotStoriesValidating ? true : false}
            title="Reload"
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
          <Select
            size="small"
            value={cateValue ? cateValue.value : ""}
            onChange={(event: SelectChangeEvent, child: any) =>
              handleChange(event, child)
            }
            displayEmpty
            title="Chọn thể loại"
            input={
              <OutlinedInput
                sx={{
                  bgcolor: "myBackground.input",
                }}
                size="small"
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
            breakpoint: 428,
            cols: 3,
            rows: 2,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 390,
            cols: 2,
            rows: 2,
            gap: 10,
            loop: true,
          },
        ]}
      >
        {hotStoriesValidating
          ? carouselPreRender()
          : hotStoriesList?.result.map((story: HotStoriesInterface) => {
              return (
                <Carousel.Item key={story._id}>
                  <BoxWrapper
                    href={`/story/${story.story_code}`}
                    title={story.story_title}
                  >
                    <Image
                      fill={true}
                      sizes="180px"
                      src={story.story_cover}
                      alt={story.story_title}
                      placeholder="empty"
                      loading="eager"
                      quality={75}
                    />
                    <BoxTitle>{story.story_title}</BoxTitle>
                  </BoxWrapper>
                </Carousel.Item>
              );
            })}
      </Carousel>
    </>
  );
};

export default HomeHotStories;
