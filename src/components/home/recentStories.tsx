import { IndexRowLoading } from "@/components/loading";
import { CategoryInterface } from "@/models/categories";
import { RecentStoriesInterface } from "@/models/home";
import { timeSince } from "@/utils/function";
import CachedIcon from "@mui/icons-material/Cached";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { styled } from "@mui/material/styles";

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

const ReloadButtonStyled = styled(Button)(() => ({
  p: ".5px",
  minWidth: "unset",
  ml: 1,
}));

const StackWrapper = styled(Stack)(() => ({
  border: "1px dashed #7986cba6",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "#fff",
}));

const RowWrapper = styled(Stack)(() => ({
  justifyContent: "space-between",
  color: "#fff",
  fontWeight: "500",
  backgroundColor: "#7986cbc2",
  borderRadius: "10px 10px 0 0",
  margin: "4px 4px 0 4px",
  padding: "8px 16px",
  "& div": {
    padding: "4px",
  },
}));

const FirstRowHeading = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  [theme.breakpoints.up("xs")]: {
    width: "80%",
  },
  [theme.breakpoints.up("md")]: {
    width: "70%",
  },
}));

const SecondRowHeading = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  textAlign: "right",
  [theme.breakpoints.up("xs")]: {
    width: "20%",
  },
  [theme.breakpoints.up("md")]: {
    width: "15%",
  },
}));

const ThirdRowHeading = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  textAlign: "right",
  [theme.breakpoints.up("xs")]: {
    display: "none",
  },
  [theme.breakpoints.up("md")]: {
    width: "15%",
    display: "flex",
  },
}));

const ItemRowWrapper = styled(Stack)(() => ({
  justifyContent: "space-between",
  flexWrap: "wrap",
  borderBottom: "1px dashed #7986cba6",
  "&:last-of-type": {
    borderBottom: "none",
  },
  "&>div": {
    padding: "4px",
    backgroundColor: "#fff",
  },
  "& a": {
    textDecoration: "none",
  },
}));

const ItemFirstRow = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "80%",
  },
  [theme.breakpoints.up("md")]: {
    width: "70%",
  },
}));

const ItemSecondRow = styled(Box)(({ theme }) => ({
  textAlign: "right",
  [theme.breakpoints.up("xs")]: {
    width: "20%",
  },
  [theme.breakpoints.up("md")]: {
    width: "15%",
  },
}));

const ItemThirdRow = styled(Box)(({ theme }) => ({
  textAlign: "right",
  fontSize: ".9em",
  lineHeight: "22px",
  [theme.breakpoints.up("xs")]: {
    display: "none",
  },
  [theme.breakpoints.up("md")]: {
    width: "15%",
    display: "block",
  },
}));

const ItemIcon = styled("span")(() => ({
  display: "inline-block",
  height: "20px",
  "& svg": {
    width: "20px",
    height: "20px",
  },
}));

const ItemMainLink = styled(Link)(() => ({
  lineHeight: "20px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  letterSpacing: "-.5px",
}));

type Props = {
  categories: CategoryInterface[];
};

export const IndexRecentStories = ({ categories }: Props) => {
  const [cateValue, setCateValue] = useState<
    | {
        value: string;
        children: string;
      }
    | null
    | undefined
  >(null);

  const {
    data: recentUpdateStoriesList,
    mutate: recenUpdatetStoriesListMutate,
    isValidating: recentUpdateStoriesValidating,
  } = useSWR(
    `/stories/getRecentUpdate?limit=30${
      cateValue ? "&category=" + cateValue.value : ""
    }`,
    {
      keepPreviousData: true,
      // refreshInterval: 10000,
    }
  );
  const handleChange = (
    event: SelectChangeEvent,
    child?: { props: { value: string; children: string } }
  ) => {
    setCateValue(child?.props);
  };

  const preDataRender = () => {
    let result = [];
    for (let i = 0; i < 30; i++) {
      result.push(<IndexRowLoading key={i} />);
    }
    return result;
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
        <Box component={"h2"} m={0}>
          Truyện mới cập nhật
          <ReloadButtonStyled
            type={"button"}
            onClick={() => recenUpdatetStoriesListMutate()}
            disabled={recentUpdateStoriesValidating ? true : false}
          >
            {recentUpdateStoriesValidating ? (
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
      </Stack>
      <Box className={"hr"} my={2} />

      <StackWrapper>
        <RowWrapper direction={"row"}>
          <FirstRowHeading>TÊN TRUYỆN</FirstRowHeading>
          <SecondRowHeading>C.CUỐI</SecondRowHeading>
          <ThirdRowHeading>UPDATE</ThirdRowHeading>
        </RowWrapper>

        {recentUpdateStoriesValidating
          ? preDataRender()
          : recentUpdateStoriesList?.result?.map(
              (story: RecentStoriesInterface, index: number) => {
                if (story.lastChapter)
                  story.lastChapter.chapter_name =
                    story.lastChapter?.chapter_name
                      .replaceAll("Chương ", "C")
                      .replaceAll("Quyển ", "Q")
                      .replaceAll(" - ", "-")
                      .replaceAll("CHƯƠNG ", "C")
                      .replaceAll("QUYỂN ", "Q");
                return (
                  <ItemRowWrapper key={story._id} direction={"row"}>
                    <ItemFirstRow>
                      <Stack direction={"row"} alignItems={"center"}>
                        <ItemIcon
                          sx={{
                            color:
                              (index + 1 === 1 && "error.main") ||
                              (index + 1 === 2 && "success.main") ||
                              (index + 1 === 3 && "info.main") ||
                              "#ccc",
                          }}
                        >
                          <KeyboardArrowRightIcon />
                        </ItemIcon>
                        <ItemMainLink href={`/story/${story.story_code}`}>
                          {story.story_title}
                        </ItemMainLink>
                      </Stack>
                    </ItemFirstRow>
                    <ItemSecondRow>
                      <Box
                        component={Link}
                        href={`/story/${story.story_code}/${story?.lastChapter?.chapter_code}`}
                      >
                        {story?.lastChapter?.chapter_name}
                      </Box>
                    </ItemSecondRow>
                    <ItemThirdRow>
                      {timeSince(
                        Math.abs(
                          new Date().valueOf() -
                            new Date(story?.updated_at).valueOf()
                        )
                      )}{" "}
                      trước
                    </ItemThirdRow>
                  </ItemRowWrapper>
                );
              }
            )}
      </StackWrapper>
    </>
  );
};
