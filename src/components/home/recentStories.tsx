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
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
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

export const IndexRecentStories = ({ categories }: Props) => {
  const [cateValue, setCateValue] = useState<
    | {
        value: string;
        children: string;
      }
    | null
    | undefined
  >(null);
  const lengthLimit = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableSectionElement>(null);

  const {
    data: recentUpdateStoriesList,
    mutate: recenUpdatetStoriesListMutate,
    isValidating: recentUpdateStoriesValidating,
  } = useSWR(
    `/stories/getRecentUpdate${
      cateValue ? "?category=" + cateValue.value : ""
    }`,
    {
      keepPreviousData: true,
      refreshInterval: 10000,
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
    for (let i = 0; i < 25; i++) {
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
          <Box
            component={Button}
            p={".5px"}
            minWidth={"unset"}
            type={"button"}
            ml={1}
            onClick={() => recenUpdatetStoriesListMutate()}
            disabled={recentUpdateStoriesValidating ? true : false}
          >
            {recentUpdateStoriesValidating ? (
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

      <Stack border={"1px solid #ccc"} borderRadius={"4px"} overflow={"hidden"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{
            "& div": {
              p: "4px",
              borderBottom: "1px solid #ccc",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: "bold",
              fontSize: ".9em",
              height: "36.5px",
            },
          }}
        >
          <Stack
            justifyContent={"center"}
            width={{
              md: "70%",
              xs: "80%",
            }}
          >
            TÊN TRUYỆN
          </Stack>
          <Stack
            justifyContent={"center"}
            textAlign={"right"}
            width={{
              md: "10%",
              xs: "20%",
            }}
          >
            C.CUỐI
          </Stack>
          <Stack
            textAlign={"right"}
            justifyContent={"center"}
            width={{
              md: "20%",
            }}
            display={{
              md: "flex",
              xs: "none",
            }}
          >
            UPDATE
          </Stack>
        </Stack>

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
                  <Stack
                    key={story._id}
                    direction={"row"}
                    justifyContent={"space-between"}
                    flexWrap={"wrap"}
                    sx={{
                      "&>div": {
                        p: "4px",
                        bgcolor: "#fff",
                        borderBottom: "1px solid #eee",
                      },
                      "& a": {
                        textDecoration: "none",
                      },
                    }}
                  >
                    <Box
                      width={{
                        md: "70%",
                        xs: "80%",
                      }}
                    >
                      <Stack direction={"row"} alignItems={"center"}>
                        <Box
                          component={"span"}
                          display={"inline-block"}
                          height={"20px"}
                          color={
                            (index + 1 === 1 && "error.main") ||
                            (index + 1 === 2 && "success.main") ||
                            (index + 1 === 3 && "info.main") ||
                            "#ccc"
                          }
                          sx={{
                            "& svg": {
                              width: "20px",
                              height: "20px",
                            },
                          }}
                        >
                          <KeyboardArrowRightIcon />
                        </Box>
                        <Box
                          component={Link}
                          href={`/story/${story.story_code}`}
                          lineHeight={"20px"}
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {story.story_title}
                        </Box>
                      </Stack>
                    </Box>
                    <Box
                      textAlign={"right"}
                      width={{
                        md: "10%",
                        xs: "20%",
                      }}
                    >
                      <Box
                        component={Link}
                        href={`/story/${story.story_code}/${story?.lastChapter?.chapter_code}`}
                      >
                        {story?.lastChapter?.chapter_name}
                      </Box>
                    </Box>
                    <Box
                      width={{
                        md: "20%",
                      }}
                      fontSize={".9em"}
                      textAlign={"right"}
                      display={{
                        md: "block",
                        xs: "none",
                      }}
                    >
                      {timeSince(
                        Math.abs(
                          new Date().valueOf() -
                            new Date(story?.updated_at).valueOf()
                        )
                      )}{" "}
                      trước
                    </Box>
                  </Stack>
                );
              }
            )}
      </Stack>
    </>
  );
};
