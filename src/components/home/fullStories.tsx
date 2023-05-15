import { CategoryInterface } from "@/models/categories";
import { FullStoriesInterface } from "@/models/home";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Carousel from "better-react-carousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { FullStoriesLoading } from "../loading/fullStoriesLoading";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

const BoxWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "10px",
  marginTop: "16px",
  justifyContent: "space-between",
  [theme.breakpoints.up("xs")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

const ReloadButtonStyled = styled(Button)(() => ({
  padding: ".5px",
  minWidth: "unset",
  marginLeft: 1,
}));

const ItemLinkWrapper = styled(Link)(() => ({
  width: "100%",
  padding: 0,
  margin: 0,
  position: "relative",
  height: "150px",
  display: "block",
  borderRadius: "5px",
  overflow: "hidden",
}));

const ItemImg = styled("img")(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const ItemChapter = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  position: "absolute",
  display: "block",
  bottom: 0,
  left: 0,
  padding: "4px",
  fontSize: ".85em",
  backgroundColor: "rgba(0, 0, 0, .4)",
  textShadow: `0 0 10px ${theme.palette.primary.main}`,
  maxHeight: "24px",
  overflow: "hidden",
  textAlign: "center",
  color: theme.palette.primary.contrastText,
}));

const ItemTitle = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  fontSize: ".9em",
  display: "block",
  textAlign: "center",
  color: theme.palette.primary.main,
  textShadow: "1px 1px 2px rgba(0, 0, 0, .05)",
  maxHeight: "38px",
  overflow: "hidden",
}));

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
    data: fullStoriesListData,
    mutate: fullStoriesListMutate,
    isValidating: fullStoriesValidating,
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
          <FullStoriesLoading key={i} />
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
      <BoxWrapper>
        <Box component={"h2"} m={0}>
          Truyện đã hoàn thành
          <ReloadButtonStyled
            type={"button"}
            onClick={() => fullStoriesListMutate()}
            disabled={fullStoriesValidating ? true : false}
          >
            {fullStoriesValidating ? (
              <CircularProgress size={"1.5em"} color="inherit" />
            ) : (
              <CachedIcon />
            )}
          </ReloadButtonStyled>
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
      </BoxWrapper>
      <Box className={"hr"} my={2} />
      <Carousel
        mobileBreakpoint={100}
        cols={7}
        rows={4}
        gap={10}
        responsiveLayout={[
          {
            breakpoint: 900,
            cols: 7,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 800,
            cols: 6,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 700,
            cols: 5,
            rows: 4,
            gap: 10,
            loop: true,
          },

          {
            breakpoint: 600,
            cols: 4,
            rows: 4,
            gap: 10,
            loop: true,
          },
          {
            breakpoint: 400,
            cols: 3,
            rows: 4,
            gap: 10,
            loop: true,
          },
        ]}
      >
        {fullStoriesValidating
          ? carouselPreRender()
          : fullStoriesListData?.result.map((story: FullStoriesInterface) => {
              return (
                <Carousel.Item key={story._id}>
                  <ItemLinkWrapper href={`/story/${story.story_code}`}>
                    <ItemImg src={story.story_cover} alt={story.story_title} />
                    <ItemChapter>Full - {story._count} chương</ItemChapter>
                  </ItemLinkWrapper>
                  <ItemTitle href={`/story/${story.story_code}`}>
                    {story.story_title}
                  </ItemTitle>
                </Carousel.Item>
              );
            })}
      </Carousel>
    </>
  );
};
