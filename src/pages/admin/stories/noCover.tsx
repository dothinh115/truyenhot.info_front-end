import { AdminNoCoverStoriesRow, AdminSearchBar } from "@/components/admin";
import { RowStory } from "@/components/categories";
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
        <Container maxWidth={"sm"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            m={{ md: 1, xs: 0 }}
          >
            <Box component={"h2"} my={1}>
              <Box component={"span"} display={{ md: "inline", xs: "none" }}>
                Truyện đăng gần đây
              </Box>
            </Box>
            <Stack direction={"row"} alignItems={"center"}>
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
            </Stack>
          </Stack>
          <Box component={"ul"} m={0} p={0}>
            {storiesList?.result.map((story: StoryInterface) => {
              return (
                <AdminNoCoverStoriesRow
                  key={story._id}
                  storyData={story}
                  mutate={storiesListMutate}
                />
              );
            })}
          </Box>
        </Container>
      </Stack>
    </>
  );
};

AdminNoCoverStories.Layout = AdminLayout;

export default AdminNoCoverStories;
