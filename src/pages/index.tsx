import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { BaseStats } from "@/components/home";
import { CategoriesSidebar } from "@/components/sidebar";
import { CategoryInterface, RecentStoriesInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import { timeSince } from "@/utils/function";
import CachedIcon from "@mui/icons-material/Cached";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Container,
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

type Props = {};

const Index = (props: Props) => {
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
    isLoading: recentUpdateStoriesIsLoading,
  } = useSWR(
    `/stories/getRecentUpdate${
      cateValue ? "?category=" + cateValue.value : ""
    }`,
    {
      keepPreviousData: true,
    }
  );

  const { data: categoriesData } = useSWR(`/categories/getAll`, {
    dedupingInterval: 60 * 60 * 24,
  });

  const handleChange = (
    event: SelectChangeEvent,
    child?: { props: { value: string; children: string } }
  ) => {
    setCateValue(child?.props);
  };

  const preDataRender = () => {
    let result = [];
    for (let i = 0; i < 25; i++) {
      result.push(
        <TableRow
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            "& td": { p: "6px" },
            "& td span": {
              display: "inline-block",
              maxHeight: "24px!important",
            },
          }}
          key={i}
        >
          <TableCell scope="row" colSpan={3} height={"37px"}>
            <Stack direction={"row"} alignItems={"center"}>
              <Box
                component={"span"}
                color={
                  (i + 1 === 1 && "error.main") ||
                  (i + 1 === 2 && "success.main") ||
                  (i + 1 === 3 && "info.main") ||
                  "#ccc"
                }
              >
                <KeyboardArrowRightIcon />
              </Box>
              <CircularProgress size={"1em"} />
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
    return result;
  };

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
      scroll={true}
    >
      <HomeIcon />
    </Box>,
  ];
  return (
    <>
      <Seo
        data={{
          title: `Đọc truyện online, truyện hay, truyện hot, truyện full, truyện mới nhất, truyenhot.info`,
          description: `Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info`,
          thumbnailUrl: `${apiURL}/api/public/images/thumnail/thumbnail.jpg`,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={4}>
        <Container maxWidth={"md"}>
          <Stack
            direction={"row"}
            gap={"15px"}
            flexWrap={{
              xs: "wrap",
              md: "nowrap",
            }}
          >
            <Box
              width={{
                md: "70%",
                xs: "100%",
              }}
            >
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
                    onClick={() =>
                      recenUpdatetStoriesListMutate(recentUpdateStoriesList)
                    }
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
                    {categoriesData?.result.map((cate: CategoryInterface) => (
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
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên truyện</TableCell>
                      <TableCell align="right">
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
                        }}
                      >
                        Thời gian
                      </Box>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUpdateStoriesIsLoading && preDataRender()}
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
                              "&:last-child td, &:last-child th": { border: 0 },
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
                              },
                            }}
                            key={story.story_id}
                          >
                            <TableCell scope="row">
                              <Box
                                display={{
                                  md: "flex",
                                  xs: "none",
                                }}
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
                                {story.story_title.length > 40
                                  ? story.story_title.substring(0, 39) + " ..."
                                  : story.story_title}
                              </Box>

                              <Box
                                display={{
                                  md: "none",
                                  xs: "inline-flex",
                                }}
                                component={Link}
                                alignItems={"center"}
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
                                {story.story_title.length > 20
                                  ? story.story_title.substring(0, 19) + "..."
                                  : story.story_title}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                component={Link}
                                href={`/story/${story.story_code}/${story.lastChapter?.chapter_code}`}
                              >
                                {story.lastChapter?.chapter_name.length > 18
                                  ? story.lastChapter?.chapter_name.substring(
                                      0,
                                      17
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
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box
              width={{
                md: "30%",
                xs: "100%",
              }}
            >
              <CategoriesSidebar />
              <BaseStats />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default Index;
