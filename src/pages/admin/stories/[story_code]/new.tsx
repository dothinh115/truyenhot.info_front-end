import { useSnackbar } from "@/hooks/snackbar";
import { API, modules } from "@/utils/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { useRef } from "react";
import { AdminLayout } from "@/layouts/admin";

type Props = {};
interface ChapterCreateInterface {
  chapter_name: string;
  chapter_content: string;
  chapter_title: string;
  chapter_code: string;
}
interface CreateByUrlInterface {
  url: string;
}
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const AdminNewChapter = (props: Props) => {
  const { setSnackbar, snackbar } = useSnackbar();

  const router = useRouter();
  const { story_code } = router.query;
  const button = useRef<HTMLButtonElement | null>(null);
  const {
    data: storyData,
    isLoading,
    mutate,
  } = useSWR(`/stories/getDetail/${story_code}`, { revalidateOnMount: false });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChapterCreateInterface>({
    mode: "onChange",
    defaultValues: {
      chapter_content: "",
      chapter_title: "",
      chapter_name: "",
      chapter_code: "",
    },
  });

  const {
    control: createByUrlControl,
    handleSubmit: createByUrlHandleSubmit,
    reset: createByUrlReset,
    formState: {
      errors: createByUrlErrors,
      isSubmitting: createByUrlIsSubmitting,
    },
  } = useForm<CreateByUrlInterface>({
    mode: "onChange",
    defaultValues: {
      url: "",
    },
  });

  const createChapterSubmitHandle = async (data: any) => {
    if (data.chapter_code === "") {
      delete data.chapter_code;
    }
    try {
      await API.post(`/chapter/new/${story_code}`, data);
      setSnackbar({
        open: true,
        message: "Tạo chương mới thành công!",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data.message,
        type: "error",
      });
    } finally {
      await reset({
        chapter_title: "",
        chapter_content: "",
        chapter_name: "",
        chapter_code: "",
      });
      createByUrlReset({
        url: "",
      });
    }
  };

  const createByUrlSubmitHandle = async (data: any) => {
    try {
      const response: any = await API.get(
        `/bot/updateSingleChapterByUrl?url=${data.url}`
      );
      await API.post(`/chapter/new/${story_code}`, response.result);
      createByUrlReset({
        url: "",
      });
      setSnackbar({
        open: true,
        message: "Tạo chương mới thành công!",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data.message,
        type: "error",
      });
    }
  };
  return (
    <>
      {snackbar}
      <Stack direction={"row"} justifyContent={"center"} my={2}>
        <Container maxWidth={"md"}>
          <Box component={"h2"} m={0}>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (router.query.goAround) router.back();
                else
                  router.push({
                    pathname: "/admin/stories/[story_code]",
                    query: {
                      story_code,
                    },
                  });
              }}
              sx={{
                mr: 1,
              }}
            >
              <ArrowBackIcon />
            </Button>
            Tạo chương mới {`[${storyData?.result.story_title}]`}
          </Box>
          <Box className={"hr"} my={2} />
          <Box
            component={"form"}
            onSubmit={handleSubmit(createChapterSubmitHandle)}
          >
            <Controller
              name={"chapter_name"}
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
                  label={"Số chương"}
                  onChange={(event) => onChange(event.target.value)}
                  value={value}
                  error={!!errors.chapter_title?.message}
                  helperText={
                    errors.chapter_title?.message
                      ? errors.chapter_title?.message
                      : null
                  }
                />
              )}
            />

            <Controller
              name={"chapter_title"}
              control={control}
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
                  label={"Tiêu đề chương"}
                  onChange={(event) => onChange(event.target.value)}
                  value={value}
                />
              )}
            />

            <Controller
              name={"chapter_code"}
              control={control}
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
                  label={"Code chương"}
                  onChange={(event) => onChange(event.target.value)}
                  value={value}
                />
              )}
            />

            <Controller
              name={"chapter_content"}
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
                    "& > div ": {
                      maxHeight: "500px",
                      overflow: "auto",
                    },
                  }}
                />
              )}
            />
            <Box textAlign={"right"}>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={"1em"} color="inherit" />
                  ) : null
                }
                disabled={isSubmitting ? true : false}
                ref={button}
              >
                Tạo
              </Button>
            </Box>
          </Box>
          <Box component={"h2"}>Lấy data bằng url truyenfull</Box>
          <Box className={"hr"} my={2} />
          <Box
            component={"form"}
            onSubmit={createByUrlHandleSubmit(createByUrlSubmitHandle)}
          >
            <Controller
              name={"url"}
              control={createByUrlControl}
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
                  label={"Link chương truyện"}
                  onChange={(event) => onChange(event.target.value)}
                  value={value}
                  error={!!createByUrlErrors.url?.message}
                  helperText={
                    createByUrlErrors.url?.message
                      ? errors.chapter_title?.message
                      : null
                  }
                />
              )}
            />
            <Box textAlign={"right"}>
              <Button
                type="submit"
                variant="contained"
                color="info"
                startIcon={
                  createByUrlIsSubmitting ? (
                    <CircularProgress size={"1em"} color="inherit" />
                  ) : null
                }
                disabled={createByUrlIsSubmitting ? true : false}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Container>
      </Stack>
    </>
  );
};

AdminNewChapter.Layout = AdminLayout;

export default AdminNewChapter;
