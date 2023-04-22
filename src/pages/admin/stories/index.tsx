import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout, AdminLayoutContext } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import { API } from "@/utils/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Container,
} from "@mui/material";
import Link from "next/link";
import useSWR from "swr";
import React, { useState, useContext, useEffect } from "react";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";

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
    mutate,
    isLoading,
  } = useSWR("/stories/getAll?limit=100");
  const { setLoading } = useContext<any>(AdminLayoutContext);
  const { snackbar, setSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const deleteHandle = async (story_id: string) => {
    setLoading(true);
    try {
      await API.delete(`/stories/delete/${story_id}`);
      await mutate();
      setSnackbar({
        message: "Xóa truyện thành công",
        open: true,
      });
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const reloadHandle = () => mutate();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      {snackbar}
      <Stack flexDirection={"row"} justifyContent={"center"} p={2}>
        <Container maxWidth={"md"}>
          <Stack direction={"row"} justifyContent={"space-between"} m={1}>
            <Box component={"h2"} my={1}>
              Truyện đăng gần đây
              <Box
                component={Button}
                type="button"
                size="small"
                variant="contained"
                ml={1}
                onClick={reloadHandle}
              >
                Reload
              </Box>
            </Box>
            <Button
              component={Link}
              href={"/admin/stories/new"}
              variant="contained"
              size="small"
            >
              Thêm truyện mới
            </Button>
          </Stack>
          <Box className={"hr"} my={3} />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={"50px"} align="center">
                    Cover
                  </TableCell>
                  <TableCell>Tên truyện</TableCell>
                  <TableCell width={"20%"} align="center">
                    Tác giả
                  </TableCell>

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
                      <TableCell>
                        <Box
                          component={"img"}
                          src={story.story_cover}
                          sx={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
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
                      <TableCell>{story.story_author}</TableCell>
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
                        <Button
                          color="error"
                          variant="contained"
                          type="button"
                          fullWidth={false}
                          sx={{
                            minWidth: "unset",
                          }}
                          onClick={() => deleteHandle(story.story_code)}
                        >
                          <DeleteForeverIcon />
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
