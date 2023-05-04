import { IndexRowLoading } from "@/components/loading";
import { CategoryInterface, RecentStoriesInterface } from "@/models/categories";
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
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { SelectChangeEvent } from "@mui/material/Select";
import Link from "next/link";
import { useState } from "react";
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
      <TableContainer component={Paper}>
        <Table
          size="small"
          sx={{
            "& th": {
              fontWeight: "bold",
              textTransform: "uppercase",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: {
                xs: "0.775rem",
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ p: "6px" }}>Tên truyện</TableCell>
              <TableCell
                align="right"
                sx={{
                  width: {
                    md: "100px",
                    xs: "75px",
                  },
                  p: "6px 6px 6px 0",
                }}
              >
                C
                <Box
                  display={{
                    md: "inline",
                    xs: "none",
                  }}
                  component={"span"}
                >
                  hương
                </Box>
                <Box
                  display={{
                    md: "none",
                    xs: "inline",
                  }}
                  component={"span"}
                >
                  .
                </Box>{" "}
                cuối
              </TableCell>
              <Box
                component={TableCell}
                align="right"
                sx={{
                  display: {
                    md: "table-cell",
                    xs: "none",
                  },
                  p: "6px",
                }}
              >
                Thời gian
              </Box>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUpdateStoriesValidating ? (
              preDataRender()
            ) : (
              <>
                {recentUpdateStoriesList?.result?.map(
                  (story: RecentStoriesInterface, index: number) => {
                    if (story.lastChapter)
                      story.lastChapter.chapter_name =
                        story.lastChapter?.chapter_name
                          .replaceAll("Chương ", "C")
                          .replaceAll("Quyển ", "Q")
                          .replaceAll(" - ", "-");
                    return (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                          "& td a": {
                            textDecoration: "none",
                            fontSize: "14px",
                          },
                          "& td.cate-table a": {
                            mr: "2px",
                            "&:not(:last-of-type)::after": {
                              content: '", "',
                            },
                          },
                          "& td span": {
                            display: "inline-block",
                            maxHeight: "24px!important",
                          },

                          "& td": {
                            p: "6px",
                            lineHeight: "24px",
                            maxHeight: "37px",
                            wordSpacing: "-1px",
                          },
                        }}
                        key={story.story_id}
                      >
                        <TableCell
                          scope="row"
                          sx={{
                            pl: "0!important",
                          }}
                        >
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            component={Link}
                            href={`/story/${story.story_code}`}
                          >
                            <Box
                              component={"span"}
                              color={
                                (index + 1 === 1 && "error.main") ||
                                (index + 1 === 2 && "success.main") ||
                                (index + 1 === 3 && "info.main") ||
                                "#ccc"
                              }
                            >
                              <KeyboardArrowRightIcon />
                            </Box>
                            <Box
                              display={{
                                md: "inline-block",
                                xs: "none",
                              }}
                            >
                              {story.story_title.length > 55
                                ? story.story_title.substring(0, 54) + " ..."
                                : story.story_title}
                            </Box>
                            <Box
                              display={{
                                md: "none",
                                xs: "inline-block",
                              }}
                            >
                              {story.story_title.length > 30
                                ? story.story_title.substring(0, 27) + "..."
                                : story.story_title}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component={Link}
                            href={`/story/${story.story_code}/${story.lastChapter?.chapter_code}`}
                          >
                            {story.lastChapter?.chapter_name.length > 22
                              ? story.lastChapter?.chapter_name.substring(
                                  0,
                                  21
                                ) + " ..."
                              : story.lastChapter?.chapter_name}
                          </Box>
                        </TableCell>

                        <Box
                          component={TableCell}
                          align="right"
                          display={{
                            md: "table-cell",
                            xs: "none",
                          }}
                          fontSize={".9em"}
                        >
                          {timeSince(
                            Math.abs(
                              new Date().valueOf() -
                                new Date(story?.updated_at).valueOf()
                            )
                          )}{" "}
                          trước
                        </Box>
                      </TableRow>
                    );
                  }
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
