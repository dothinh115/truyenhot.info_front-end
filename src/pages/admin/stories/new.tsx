import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts";
import { CategoryInterface } from "@/models/categories";
import { NewStoryInterface } from "@/models/stories";
import { NProgressDone, NProgressStart } from "@/pages/_app";
import { API, modules } from "@/utils/config";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import dynamic from "next/dynamic";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {};

interface NewStoryByUrlInterface {
  url: string;
}

const newStoryShape: NewStoryInterface = {
  story_title: "",
  story_author: "",
  story_category: [],
  story_description: "",
  story_source: "",
};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const AdminNewStories = (props: Props) => {
  const { data: categoriesList } = useSWR("/categories/getAll");
  const { snackbar, setSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<NewStoryInterface>({
    mode: "onChange",
    defaultValues: newStoryShape,
  });

  const {
    control: urlControl,
    handleSubmit: urlHandleSubmit,
    formState: { errors: urlErrors, isSubmitting: urlIsSubmitting },
    reset: urlReset,
  } = useForm<NewStoryByUrlInterface>({
    mode: "onChange",
    defaultValues: {
      url: "",
    },
  });

  const newStorySubmitHandle = async (data: any) => {
    try {
      let cateList: CategoryInterface[] = [];
      for (let cate of data.story_category) {
        cateList = [...cateList, cate.cate_id];
      }
      const newData = {
        ...data,
        story_category: cateList.join(","),
        story_description: data.story_description,
      };

      const formData = new FormData();
      for (let key in newData) {
        formData.append(key, newData[key]);
      }
      await API({
        url: "/stories/new",
        data: formData,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackbar({
        message: "Thêm truyện thành công",
        open: true,
      });
      reset(newStoryShape);
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    }
  };

  const newStoryByUrlSubmitHanle = async (data: any) => {
    NProgressStart();
    try {
      await API.get(`/bot/createStoryByUrl?url=${data.url}`);
      setSnackbar({
        message: "Thêm truyện thành công",
        open: true,
      });
      urlReset({
        url: "",
      });
      setSnackbar({
        message: "Thêm truyện thành công",
        open: true,
      });
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    } finally {
      NProgressDone();
    }
  };

  return (
    <>
      {snackbar}
      <Stack
        component={"div"}
        flexDirection={"row"}
        justifyContent={"center"}
        p={2}
      >
        <Container maxWidth={"md"}>
          <Box component={"h2"}>Đăng truyện mới</Box>
          <Box className={"hr"} my={2} />
          <Box component={"form"} onSubmit={handleSubmit(newStorySubmitHandle)}>
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
                  label={"Tiêu đề truyện"}
                  onChange={onChange}
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
                    <TextField sx={{ mb: 1 }} {...params} label="Thể loại" />
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
                    const file = (currentTarget as HTMLInputElement).files![0];
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
              <Button type="submit" variant="contained">
                Đăng
              </Button>
            </Stack>
          </Box>
          <Box className={"hr"} my={2} />
          <Box
            component={"form"}
            onSubmit={urlHandleSubmit(newStoryByUrlSubmitHanle)}
          >
            <Controller
              control={urlControl}
              name="url"
              rules={{
                required: "Không được để trống",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  type="text"
                  label={"Đăng truyện qua url truyenfull"}
                  onChange={onChange}
                  error={!!urlErrors.url?.message}
                  helperText={
                    urlErrors.url?.message
                      ? urlErrors.url?.message?.toString()
                      : null
                  }
                  value={value}
                />
              )}
            />

            <Stack flexDirection={"row"} justifyContent={"flex-end"} mt={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={urlIsSubmitting ? true : false}
                startIcon={
                  urlIsSubmitting && (
                    <CircularProgress color="inherit" size={"1em"} />
                  )
                }
              >
                Đăng
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              mt: 4,
            }}
          ></Box>
        </Container>
      </Stack>
    </>
  );
};

AdminNewStories.Layout = AdminLayout;

export default AdminNewStories;
