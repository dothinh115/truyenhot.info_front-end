import { AdminSearchBar } from "@/components/admin";
import { AdminLayout } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import { timeSince } from "@/utils/function";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

type Props = {};

const AdminNoCoverStories = (props: Props) => {
  const {
    data: storiesList,
    mutate: storiesListMutate,
    isValidating: storiesValidating,
  } = useSWR("/admin/getNoCoverStories");

  const router = useRouter();

  const reloadHandle = () => storiesListMutate();

  return (
    <>
      <Stack
        flexDirection={"row"}
        justifyContent={"center"}
        p={{ md: 2, xs: 0 }}
      >
        <Container maxWidth={"md"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            m={{ md: 1, xs: 0 }}
          >
            <Box component={"h2"} my={1}>
              <Box component={"span"} display={{ md: "inline", xs: "none" }}>
                Truyện đăng gần đây
              </Box>
              <Box
                component={Button}
                type="button"
                size="small"
                variant="contained"
                ml={1}
                onClick={reloadHandle}
                disabled={storiesValidating ? true : false}
                startIcon={
                  storiesValidating && (
                    <CircularProgress color="inherit" size={"1em"} />
                  )
                }
              >
                Reload
              </Box>
            </Box>
            <Stack direction={"row"} alignItems={"center"}>
              <Box
                component={Button}
                variant="contained"
                size="small"
                onClick={() => router.push("/admin/stories/new")}
              >
                Thêm truyện mới
              </Box>
            </Stack>
          </Stack>
          <Box className={"hr"} my={3} />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    width={"50px"}
                    align="center"
                    sx={{
                      display: {
                        md: "table-cell",
                        xs: "none",
                      },
                    }}
                  >
                    Cover
                  </TableCell>
                  <TableCell>
                    <AdminSearchBar />
                  </TableCell>
                  <TableCell width={"20%"}>Update</TableCell>

                  <TableCell width={"20%"} align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {storiesList?.result?.map((story: StoryInterface) => {
                  return (
                    <TableRow key={story._id}>
                      <TableCell
                        sx={{
                          display: {
                            md: "table-cell",
                            xs: "none",
                          },
                        }}
                      >
                        <Box
                          component={"img"}
                          src={story.story_cover}
                          sx={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          alt={story.story_code}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          component={"a"}
                          href={`/story/${story.story_code}`}
                          target="_blank"
                          sx={{
                            textDecoration: "none",
                          }}
                        >
                          {story.story_title}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {story?.updated_at &&
                          timeSince(
                            Math.abs(
                              new Date().valueOf() -
                                new Date(story?.updated_at).valueOf()
                            )
                          )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={Link}
                          href={`/admin/stories/${story.story_code}`}
                          color="info"
                          variant="contained"
                          type="button"
                          fullWidth={false}
                          sx={{
                            minWidth: "unset",
                            mr: 1,
                          }}
                        >
                          <SettingsIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Stack>
    </>
  );
};

AdminNoCoverStories.Layout = AdminLayout;

export default AdminNoCoverStories;
