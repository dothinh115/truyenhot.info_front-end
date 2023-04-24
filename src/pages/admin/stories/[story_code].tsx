import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout, AdminLayoutContext } from "@/layouts";
import { CategoryInterface } from "@/models/categories";
import { UpdateStoryInterface } from "@/models/stories";
import { API, modules } from "@/utils/config";
import Pagination from "@mui/material/Pagination";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

type Props = {};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

interface ChapterUpdateInterface {
  value: string;
}

const EditStory = (props: Props) => {
  const [timeoutSubmit, setTimeoutSubmit] = useState<boolean>(false);
  const { setLoading } = useContext<any>(AdminLayoutContext);
  const router = useRouter();
  const { page, story_code } = router.query;
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const {
    data: storyData,
    isLoading,
    mutate,
  } = useSWR(`/stories/getDetail/${story_code}`, { revalidateOnMount: false });

  const { data: chapterListData, mutate: chapterListMutate } = useSWR(
    `/chapter/getChapterListByStoryCode/${story_code}?page=${page ? page : 1}`,
    {
      revalidateOnMount: false,
    }
  );

  const { data: categoriesList } = useSWR("/categories/getAll");
  const { snackbar, setSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<UpdateStoryInterface>({
    mode: "onChange",
    defaultValues: {
      story_author: "",
      story_category: [],
      story_description: "",
      story_source: "",
      story_title: "",
    },
  });

  const {
    control: chapterUpdateControl,
    handleSubmit: chapterUpdateHandleSubmit,
  } = useForm<ChapterUpdateInterface>({
    mode: "onChange",
    defaultValues: {
      value: "",
    },
  });

  const updateStorySubmitHandle = async (data: any) => {
    setLoading(true);
    try {
      let cateList: CategoryInterface[] = [];
      for (let cate of data.story_category) {
        cateList = [...cateList, cate.cate_id];
      }
      data = {
        ...data,
        story_category: cateList.join(","),
      };
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }

      await API({
        url: `/stories/update/${story_code}`,
        data: formData,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await mutate();
      setSnackbar({
        message: "Update truyện thành công",
        open: true,
      });
      setTimeoutSubmit(true);
    } catch (error: any) {
      console.log(error);
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && storyData)
      reset({
        ...storyData?.result,
      });
  }, [storyData, isLoading]);

  useEffect(() => {
    if (page) {
      setPaginationPage(+page);
    }
  }, [page]);

  const deleteHandle = async () => {
    try {
      await API.delete(`/stories/delete/${story_code}`);
      router.push("/admin/stories");
    } catch (error) {
      console.log(error);
    }
  };

  const chapterDelete = async (chapter_code: string, chapter_name: string) => {
    try {
      await API.delete(`/chapter/delete/${story_code}/${chapter_code}`);

      await chapterListMutate();
      setSnackbar({
        message: `Xóa ${chapter_name} thành công`,
        open: true,
        type: "success",
      });
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    }
  };

  const chapterUpdateSubmitHandle = async (data: any) => {
    setLoading(true);
    try {
      await API.get(
        `/chapter/getFullStoryByUrl/${story_code}?url=${data.value}`
      );
      setSnackbar({
        message: `Update thành công`,
        open: true,
        type: "success",
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

  useEffect(() => {
    if (timeoutSubmit) {
      setTimeout(() => {
        setTimeoutSubmit(false);
      }, 2000);
    }
  }, [timeoutSubmit]);

  useEffect(() => {
    if (story_code) {
      mutate();
      chapterListMutate();
    }
  }, [story_code]);

  return (
    <>
      {snackbar}
      <Stack
        component={"div"}
        flexDirection={"row"}
        justifyContent={"center"}
        p={2}
        minHeight={"100vh"}
      >
        <Container maxWidth={"md"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box component={"h2"} my={1}>
              Chỉnh sửa truyện
            </Box>
            <Button
              size="small"
              variant="contained"
              color="error"
              sx={{
                height: "30px",
              }}
              onClick={deleteHandle}
            >
              <DeleteForeverIcon />
              Xóa truyện
            </Button>
          </Stack>
          <Box className={"hr"} my={2} />
          <Stack direction={"row"} spacing={2}>
            <Box
              width={"30%"}
              sx={{
                borderRight: "3px dashed #9e9e9e",
              }}
            >
              <Box component={"h1"}>Ảnh bìa</Box>
              <Box
                component={"img"}
                src={storyData?.result.story_cover}
                width={"95%"}
                mr={2}
              />
            </Box>
            <Box width={"70%"}>
              <Box
                component={"form"}
                onSubmit={handleSubmit(updateStorySubmitHandle)}
              >
                <Controller
                  name={"story_title"}
                  control={control}
                  rules={{
                    required: "Không được để trống",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      sx={{
                        mb: 1,
                      }}
                      fullWidth
                      size="small"
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label={"Tiêu đề truyện"}
                      onChange={(event) => onChange(event.target.value)}
                      value={value}
                      error={!!errors.story_title?.message}
                      helperText={
                        errors.story_title?.message
                          ? errors.story_title?.message
                          : null
                      }
                    />
                  )}
                />

                <Controller
                  name={"story_author"}
                  control={control}
                  rules={{
                    required: "Không được để trống",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      sx={{
                        mb: 1,
                      }}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="text"
                      label={"Tác giả"}
                      onChange={onChange}
                      value={value}
                      error={!!errors.story_author?.message}
                      helperText={
                        errors.story_author?.message
                          ? errors.story_author?.message
                          : null
                      }
                    />
                  )}
                />

                <Controller
                  name={"story_description"}
                  control={control}
                  rules={{
                    required: "Không được để trống",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Box
                      component={QuillNoSSRWrapper}
                      theme="snow"
                      onChange={onChange}
                      value={value}
                      modules={modules}
                      sx={{
                        mb: 2,
                        borderRadius: "4px",
                        "& > div:first-of-type": {
                          borderRadius: "4px 4px 0 0",
                        },
                        "& > div:last-of-type": {
                          borderRadius: "0 0 4px 4px",
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name={"story_source"}
                  control={control}
                  rules={{
                    required: "Không được để trống",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        mb: 1,
                      }}
                      fullWidth
                      type="text"
                      label={"Nguồn"}
                      onChange={onChange}
                      value={value}
                      error={!!errors.story_source?.message}
                      helperText={
                        errors.story_source?.message
                          ? errors.story_source?.message
                          : null
                      }
                    />
                  )}
                />

                <Controller
                  name={"story_category"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(e, data) => onChange(data)}
                      options={categoriesList?.result || []}
                      multiple
                      value={value}
                      getOptionLabel={(option) => option.cate_title}
                      isOptionEqualToValue={(option, value) =>
                        option.cate_id === value.cate_id
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ mb: 1 }}
                          {...params}
                          label="Thể loại"
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="cover_img"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <TextField
                      size="small"
                      type="file"
                      onChange={({ currentTarget }) => {
                        const file = (currentTarget as HTMLInputElement)
                          .files![0];
                        onChange(file);
                        if (file && file.size > 2000000) {
                          setError("cover_img", {
                            message: "Dung lượng vượt quá 2Mb",
                          });
                        } else {
                          clearErrors("cover_img");
                        }
                      }}
                      fullWidth
                      error={!!errors.cover_img?.message}
                      helperText={
                        errors.cover_img?.message
                          ? errors.cover_img?.message?.toString()
                          : null
                      }
                    />
                  )}
                />

                <Stack flexDirection={"row"} justifyContent={"flex-end"} mt={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={timeoutSubmit ? true : false}
                  >
                    Update
                  </Button>
                </Stack>
              </Box>
              <Box className={"hr"} my={2} />
              <Box
                component={"form"}
                onSubmit={chapterUpdateHandleSubmit(chapterUpdateSubmitHandle)}
              >
                <Stack direction={"row"}>
                  <Controller
                    name="value"
                    control={chapterUpdateControl}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        size="small"
                        fullWidth
                        onChange={onChange}
                        value={value}
                        label={"Update chapter"}
                        placeholder="Dán link truyenfull"
                        sx={{
                          mr: 1,
                        }}
                      />
                    )}
                  />
                  <Button type="submit" variant="contained">
                    Update
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Stack>

          <Box component={"h1"} fontSize={20}>
            DANH SÁCH CHƯƠNG
          </Box>
          <Box className={"hr"} />
          <Box
            component={"ul"}
            sx={{
              p: 0,
              minHeight: "330px",
              "& > li": {
                listStyleType: "none",
                width: "50%",
                display: "inline-block",
                "& a": {
                  textDecoration: "none",
                  p: 0,
                  display: "block",
                },
                "& svg": {
                  color: "red",
                  "&:hover": {
                    cursor: "pointer",
                  },
                },
              },
            }}
          >
            {chapterListData?.result.length === 0 &&
              "Không có chương truyện nào"}
            {chapterListData?.result.map((chapter: any) => {
              return (
                <Box component={"li"} key={chapter.chapter_id} pl={0}>
                  <Stack direction={"row"}>
                    <Box
                      component={ClearIcon}
                      onClick={() =>
                        chapterDelete(
                          chapter.chapter_code,
                          chapter.chapter_name
                        )
                      }
                    />
                    <Box
                      component={Link}
                      href={`/story/${chapter.story_code}/${chapter.chapter_code}`}
                    >
                      {chapter.chapter_name}
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Box>
          {chapterListData?.pagination && (
            <Stack direction={"row"} justifyContent={"center"} mt={2}>
              <Pagination
                count={chapterListData?.pagination.pages}
                page={paginationPage}
                color="primary"
                showFirstButton={true}
                showLastButton={true}
                siblingCount={2}
                onChange={(e, p) =>
                  router.push(`/admin/stories/${story_code}?page=${p}`)
                }
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          )}
        </Container>
      </Stack>
    </>
  );
};

EditStory.Layout = AdminLayout;

export default EditStory;
