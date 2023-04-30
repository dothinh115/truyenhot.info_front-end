import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { CategoriesSidebar } from "@/components/sidebar";
import { RecentStoriesInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import { timeSince } from "@/utils/function";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import useSWR from "swr";

type Props = {};

const Index = (props: Props) => {
  const {
    data: recentUpdateStoriesList,
    mutate: recenUpdatetStoriesListMutate,
    isValidating: recentUpdateStoriesValidating,
  } = useSWR("/stories/getRecentUpdate");

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
              <Box component={"h2"} m={0}>
                Truyện mới cập nhật
              </Box>
              <Box className={"hr"} my={2} />
              <TableContainer component={Paper}>
                <Table
                  size="small"
                  sx={{
                    "& th": {
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên truyện</TableCell>
                      <TableCell align="right">Chương cuối</TableCell>
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
                    {recentUpdateStoriesList?.result.map(
                      (story: RecentStoriesInterface) => {
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
                            }}
                            key={story.story_id}
                          >
                            <TableCell scope="row">
                              <Box
                                display={{
                                  md: "inline-block",
                                  xs: "none",
                                }}
                                component={Link}
                                href={`/story/${story.story_code}`}
                              >
                                {story.story_title.length > 40
                                  ? story.story_title.substring(0, 39) + "..."
                                  : story.story_title}
                              </Box>

                              <Box
                                display={{
                                  md: "none",
                                  xs: "inline-block",
                                }}
                                component={Link}
                                href={`/story/${story.story_code}`}
                              >
                                {story.story_title.length > 22
                                  ? story.story_title.substring(0, 21) + "..."
                                  : story.story_title}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                component={Link}
                                href={`/story/${story.story_code}/${story.lastChapter?.chapter_code}`}
                              >
                                {story.lastChapter?.chapter_name.length > 20
                                  ? story.lastChapter?.chapter_name.substring(
                                      0,
                                      19
                                    ) + "..."
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
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default Index;
