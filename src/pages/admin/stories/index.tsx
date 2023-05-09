import { SearchBar } from "@/components/header";
import { AdminLayout } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import { timeSince } from "@/utils/function";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
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
import IconButton from "@mui/material/IconButton";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";

type Props = {};

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const AdminStoryIndex = (props: Props) => {
  const {
    data: storiesList,
    mutate: storiesListMutate,
    isValidating: storiesValidating,
  } = useSWR("/admin/getNoCoverStories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
                    <SearchBar position="adminPage" />
                  </TableCell>
                  <TableCell width={"20%"}>Update</TableCell>

                  <TableCell width={"20%"} align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? storiesList?.result.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : storiesList?.result
                )?.map((story: StoryInterface) => {
                  return (
                    <TableRow key={story.story_id}>
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
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={4}
                    count={storiesList?.result.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Container>
      </Stack>
    </>
  );
};

AdminStoryIndex.Layout = AdminLayout;

export default AdminStoryIndex;
