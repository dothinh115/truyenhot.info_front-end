import { StoryInterface } from "@/models/stories";
import CachedIcon from "@mui/icons-material/Cached";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button } from "@mui/material";
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

export const AdminNotCompletedStories = (props: Props) => {
  const {
    data: notCompletedStoriesData,
    mutate: notCompletedStoriesMutate,
    isValidating: notCompletedStoriesIsValidating,
  } = useSWR(`/admin/getNotCompletedStories`, { dedupingInterval: 60 * 60 });
  return (
    <>
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
                  onClick={() => notCompletedStoriesMutate()}
                >
                  {notCompletedStoriesIsValidating ? (
                    <CircularProgress size={"1.5em"} color="inherit" />
                  ) : (
                    <CachedIcon />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notCompletedStoriesData?.result.map((story: StoryInterface) => {
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
                      target="_blank"
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
    </>
  );
};
