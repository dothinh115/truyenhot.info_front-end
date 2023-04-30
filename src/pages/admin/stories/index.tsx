import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts";
import { StoryInterface } from "@/models/stories";
import { API } from "@/utils/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { styled, alpha } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { StoriesSearchResultInterface } from "@/models/search";
import { timeSince } from "@/utils/function";
import { useRouter } from "next/router";

type Props = {};
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledResultList = styled(List)(() => ({
  position: "absolute",
  top: "calc(100% + 7px)",
  backgroundColor: "#fff",
  width: "100%",
  maxHeight: "200px",
  overflow: "auto",
  display: "none",
  zIndex: 100,
  border: "1px solid #ccc",
  p: 0,
}));

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
  } = useSWR("/stories/getRecentUpdate?limit=20");
  const { snackbar, setSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState<StoriesSearchResultInterface[]>(
    []
  );
  const router = useRouter();
  const resultList = useRef<HTMLUListElement>(null);
  const timeout = useRef<any>(null);
  const inputElement = useRef(null);

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
    try {
      await API.delete(`/stories/delete/${story_id}`);
      await storiesListMutate();
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
    }
  };

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget as HTMLInputElement;
    if (value === "") {
      setSearchData([]);
      if (resultList.current) resultList.current.style.display = "none";
    }
    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      if (value) {
        const result: any = await API.get(
          `/search/storyTitle?keywords=${value}`
        );
        setSearchData(result.result);
      }
      if (searchData && resultList.current)
        resultList.current.style.display = "block";
    }, 500);
  };

  const reloadHandle = () => storiesListMutate();

  const dropDownList = (event: any) => {
    if (event.target.parentNode.parentNode.parentNode === resultList.current) {
      if (resultList.current) resultList.current.style.display = "none";
    } else if (event.target.parentNode.parentNode === inputElement.current) {
      if (searchData && resultList.current)
        resultList.current.style.display = "block";
    } else {
      if (resultList.current) resultList.current.style.display = "none";
    }
  };

  useEffect(() => {
    document.addEventListener("click", dropDownList);
    return () => {
      document.removeEventListener("click", dropDownList);
    };
  }, []);

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
                  <TableCell>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>

                      <StyledInputBase
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          onChangeHandle(e);
                        }}
                        placeholder="Tìm kiếm"
                        size="small"
                        ref={inputElement}
                        autoComplete={"off"}
                      />
                      <StyledResultList ref={resultList}>
                        {searchData?.length === 0 && (
                          <ListItem
                            sx={{
                              borderBottom: "1px dashed #ccc",
                              p: 1,
                              m: 0,
                              color: "#000",
                            }}
                            dense={true}
                          >
                            <ListItemText
                              primary={
                                timeout.current
                                  ? "Loading..."
                                  : "Không có kết quả nào!"
                              }
                            />
                          </ListItem>
                        )}
                        {searchData?.map(
                          (story: StoriesSearchResultInterface) => {
                            return (
                              <ListItem
                                sx={{
                                  borderBottom: "1px dashed #ccc",
                                  p: 0,
                                  m: 0,
                                  color: "#000",
                                }}
                                dense={true}
                                key={story.story_code}
                              >
                                <ListItemButton
                                  onClick={() =>
                                    router.push({
                                      pathname: "/admin/stories/[story_code]",
                                      query: {
                                        story_code: story.story_code,
                                        goAround: true,
                                      },
                                    })
                                  }
                                >
                                  <ListItemText primary={story.story_title} />
                                </ListItemButton>
                              </ListItem>
                            );
                          }
                        )}
                      </StyledResultList>
                    </Search>
                  </TableCell>
                  <TableCell width={"20%"}>Update lần cuối</TableCell>

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
                      <TableCell>
                        {story?.updated_at &&
                          timeSince(
                            Math.abs(
                              new Date().valueOf() -
                                new Date(story?.updated_at).valueOf()
                            )
                          )}{" "}
                        trước
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
