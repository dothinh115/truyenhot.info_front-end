import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts";
import { ChapterDataInterface } from "@/models/chapters";
import { API, modules } from "@/utils/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
type Props = {};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

interface ChapterUpdateInterface {
  chapter_name: string;
  chapter_content: string;
  chapter_title: string;
}

const EditChapter = (props: Props) => {
  const router = useRouter();
  const { story_code, chapter_code } = router.query;
  const { data: chapterData, mutate: chapterMutate } = useSWR<{
    result: ChapterDataInterface;
  }>(`/chapter/getChapterDataByStoryCode/${story_code}/${chapter_code}`, {
    revalidateOnMount: false,
  });
  const { setSnackbar, snackbar } = useSnackbar();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChapterUpdateInterface>({
    mode: "onChange",
    defaultValues: {
      chapter_content: "",
      chapter_title: "",
      chapter_name: "",
    },
  });

  const updateChapterSubmitHandle = async (data: any) => {
    try {
      await API.put(
        `/chapter/updateChapter/${story_code}/${chapter_code}`,
        data
      );
      await chapterMutate();
      setSnackbar({
        open: true,
        message: "Update thành công!",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (story_code && chapter_code) chapterMutate();
  }, []);

  useEffect(() => {
    if (chapterData?.result)
      reset({
        chapter_content: chapterData?.result.chapter_content,
        chapter_title: chapterData?.result.chapter_title,
        chapter_name: chapterData?.result.chapter_name,
      });
  }, [chapterData]);
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

            {"[" + chapterData?.result.chapter_name}
            {chapterData?.result.chapter_title
              ? ": " + chapterData?.result.chapter_title
              : ""}
            {"] - ["}
            {chapterData?.result.story_title + "]"}
          </Box>
          <Box className={"hr"} my={2} />
          <Box
            component={"form"}
            onSubmit={handleSubmit(updateChapterSubmitHandle)}
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
            {chapterData?.result.chapter_title && (
              <Controller
                name={"chapter_title"}
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
                    label={"Tiêu đề chương"}
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
            )}
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
              <Button type="submit" variant="contained">
                Update
              </Button>
            </Box>
          </Box>
        </Container>
      </Stack>
    </>
  );
};

EditChapter.Layout = AdminLayout;

export default EditChapter;
