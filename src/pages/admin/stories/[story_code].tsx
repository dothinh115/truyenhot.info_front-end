import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout, AdminLayoutContext } from "@/layouts";
import { CategoryInterface } from "@/models/categories";
import { UpdateStoryInterface } from "@/models/stories";
import { API, modules } from "@/utils/config";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Link from "next/link";

type Props = {};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const EditStory = (props: Props) => {
  const [timeoutSubmit, setTimeoutSubmit] = useState<boolean>(false);
  const { setLoading } = useContext<any>(AdminLayoutContext);
  const router = useRouter();
  const {
    data: storyData,
    isLoading,
    mutate,
  } = useSWR(`/stories/getDetail/${router?.query.story_code}`);

  const {
    data: chapterData,
    isLoading: chapterLoading,
    mutate: chapterMutate,
  } = useSWR(`/chapter/getChaptersByStoryCode/${router?.query.story_code}`);

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
        url: `/stories/update/${router?.query.story_code}`,
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
    setLoading(chapterLoading);
  }, [chapterLoading]);

  const deleteHandle = async () => {
    try {
      await API.delete(`/stories/delete/${router?.query.story_code}`);
      router.push("/admin/stories");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (timeoutSubmit) {
      setTimeout(() => {
        setTimeoutSubmit(false);
      }, 2000);
    }
  }, [timeoutSubmit]);

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
                  color: "#0288d1",
                },
              },
            }}
          >
            {" "}
            {chapterData?.result.length === 0 && "Không có chương truyện nào"}
            {chapterData?.result.map((chapter: any) => {
              return (
                <Box component={"li"} key={chapter.chapter_id} pl={4}>
                  <Stack direction={"row"}>
                    <ArrowCircleRightIcon />
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
        </Container>
      </Stack>
    </>
  );
};

EditStory.Layout = AdminLayout;

export default EditStory;
