import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { BaseStats } from "@/components/home";
import { IndexRowLoading } from "@/components/loading";
import { CategoriesSidebar } from "@/components/sidebar";
import { MainLayoutContext } from "@/layouts";
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
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
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
  stats: StatsType;
  categories: CategoryInterface[];
};

type StatsType = {
  totalStories: number;
  totalViews: number;
  totalChapters: number;
};

const Index = ({ stats, categories }: Props) => {
  const [cateValue, setCateValue] = useState<
    | {
        value: string;
        children: string;
      }
    | null
    | undefined
  >(null);

  const router = useRouter();
  const { isFallback } = router;
  const { setLoading } = useContext<any>(MainLayoutContext);
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

  useEffect(() => {
    setLoading(isFallback);
  }, [isFallback]);
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
                      <TableCell
                        sx={{ p: { md: "6px 6px 6px 16px", xs: "6px" } }}
                      >
                        Tên truyện
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          width: {
                            md: "100px",
                            xs: "60px",
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
                                    lineHeight: "unset",
                                    maxHeight: "37px",
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
                                        ? story.story_title.substring(0, 54) +
                                          " ..."
                                        : story.story_title}
                                    </Box>
                                    <Box
                                      display={{
                                        md: "none",
                                        xs: "inline-block",
                                      }}
                                    >
                                      {story.story_title.length > 34
                                        ? story.story_title.substring(0, 33) +
                                          "..."
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
            </Box>
            <Box
              width={{
                md: "30%",
                xs: "100%",
              }}
            >
              <CategoriesSidebar categories={categories} />
              <BaseStats stats={stats} />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const revalidate = 1 * 60 * 60;
  const baseStatsResponse = await fetch(`${apiURL}/api/stats/getBaseStats`);
  const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
  const baseStats = await baseStatsResponse.json();
  const categories = await categoriesResponse.json();

  return {
    props: {
      stats: baseStats.result,
      categories: categories.result,
    },
    revalidate,
  };
};

export default Index;
