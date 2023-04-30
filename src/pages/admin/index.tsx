import { AdminLayout } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Container, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import useSWR from "swr";
type Props = {};

const AdminIndex = (props: Props) => {
  // const {
  //   data: dataStatsData,
  //   mutate: dataStatsMutate,
  //   isValidating: dataStatsIsValidating,
  //   isLoading: dataStatsIsLoading,
  // } = useSWR(`/admin/getDataStats`);

  const {
    data: notCompletedStoriesData,
    mutate: notCompletedStoriesMutate,
    isValidating: notCompletedStoriesIsValidating,
  } = useSWR(`/admin/getNotCompletedStories`, { dedupingInterval: 60 * 60 });

  return (
    <Stack direction={"row"} justifyContent={"center"}>
      <Container maxWidth={"md"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          p={2}
          flexWrap={"wrap"}
          sx={{
            "&>div": {
              p: 1,
            },
          }}
        >
          {/* <Box width={"50%"}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Thông tin cơ bản</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell scope="row">Tổng số truyện</TableCell>
                    <TableCell align="right">
                      {dataStatsData?.result.totalStories}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">Tổng số chương truyện</TableCell>
                    <TableCell align="right">
                      {dataStatsData?.result.totalChapters}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">Tổng số lượt xem</TableCell>
                    <TableCell align="right">
                      {dataStatsData?.result.totalViews}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box width={"50%"}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Truyện chưa có cover</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => dataStatsMutate()}
                        sx={{
                          p: 0,
                          fontSize: ".8rem",
                        }}
                      >
                        <RefreshIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!dataStatsIsLoading || !dataStatsIsValidating ? (
                    dataStatsData?.result.noCoverStoriesList.map(
                      (story: StoryInterface) => {
                        return (
                          <TableRow key={story.story_code}>
                            <TableCell scope="row" colSpan={2}>
                              <Box
                                component={Link}
                                href={`/admin/stories/${story.story_code}`}
                                sx={{
                                  textDecoration: "none",
                                }}
                              >
                                {story.story_title.length > 60
                                  ? story.story_title.substring(0, 59) + "..."
                                  : story.story_title}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )
                  ) : (
                    <TableRow>
                      <TableCell scope="row" colSpan={2}>
                        <Stack direction={"row"} alignItems={"center"}>
                          <CircularProgress
                            size={"small"}
                            color="info"
                            sx={{
                              display: "inline-block",
                              width: "30px",
                              height: "30px",
                              mr: 1,
                            }}
                          />
                          Đang lấy dữ liệu...
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box> */}

          <Box width={"50%"}>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: "330px",
              }}
            >
              <Table size="small" aria-label="a dense table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Các truyện chưa hoàn thành</TableCell>
                    <TableCell align="right" width={"65px"}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          p: "1px",
                          fontSize: ".8rem",
                        }}
                        onClick={() => notCompletedStoriesMutate()}
                      >
                        <RefreshIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!notCompletedStoriesIsValidating ? (
                    notCompletedStoriesData?.result.map(
                      (story: StoryInterface) => {
                        return (
                          <TableRow key={story.story_code}>
                            <TableCell scope="row">
                              <Box
                                component={Link}
                                sx={{
                                  textDecoration: "none",
                                }}
                                href={`/story/${story.story_code}`}
                                target="_blank"
                              >
                                {story.story_title.length > 60
                                  ? story.story_title.substring(0, 59) + "..."
                                  : story.story_title}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                LinkComponent={Link}
                                variant="contained"
                                size="small"
                                href={`/admin/stories/${story.story_code}`}
                              >
                                <SettingsIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )
                  ) : (
                    <TableRow>
                      <TableCell scope="row" colSpan={2}>
                        <Stack direction={"row"} alignItems={"center"}>
                          <CircularProgress
                            size={"small"}
                            color="info"
                            sx={{
                              display: "inline-block",
                              width: "30px",
                              height: "30px",
                              mr: 1,
                            }}
                          />
                          Đang lấy dữ liệu...
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Container>
    </Stack>
  );
};

AdminIndex.Layout = AdminLayout;

export default AdminIndex;
