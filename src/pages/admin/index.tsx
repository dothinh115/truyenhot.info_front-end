import {
  AdminNoChapterStories,
  AdminNotCompletedStories,
} from "@/components/admin/indexStats";
import { BaseStats } from "@/components/home/";
import { AdminLayout } from "@/layouts";
import { Box, Container, Stack } from "@mui/material";
type Props = {};

const AdminIndex = (props: Props) => {
  return (
    <Stack direction={"row"} justifyContent={"center"}>
      {/* <Container maxWidth={"md"}>
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
          <Stack width={"50%"} gap={2}>
            <BaseStats />
            <AdminNotCompletedStories />
          </Stack>

          <Box width={"50%"}>
            <AdminNoChapterStories />
          </Box>
        </Stack>
      </Container> */}
    </Stack>
  );
};

AdminIndex.Layout = AdminLayout;

export default AdminIndex;
