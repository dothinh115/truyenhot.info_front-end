import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  useAutocomplete,
} from "@mui/material";
import { useSnackbar } from "@/hooks/snackbar";
import { Controller, useForm } from "react-hook-form";
import { InputWrapper, Listbox, Root, StyledTag } from "@/style/autoselectBox";
import { CategoryInterface } from "@/models/categories";
import CheckIcon from "@mui/icons-material/Check";
import dynamic from "next/dynamic";
import { UpdateStoryInterface } from "@/models/stories";
import useSWR from "swr";
import { useRouter } from "next/router";
import { API, modules } from "@/utils/config";
import { AdminLayout } from "@/layouts";

type Props = {};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const EditStory = (props: Props) => {
  const { query } = useRouter();
  const {
    data: storyData,
    isLoading,
    mutate,
    error,
  } = useSWR(`/stories/getDetail/${query.story_code}`);
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
      console.log(data);
      await API({
        url: `/stories/update/${query.story_code}`,
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
    } catch (error: any) {
      console.log(error);
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && storyData)
      reset({
        ...storyData?.result,
      });
  }, [storyData, isLoading]);

  return (
    <>
      {snackbar}
      <Stack
        component={"div"}
        flexDirection={"row"}
        justifyContent={"center"}
        p={2}
        maxHeight={"calc(100vh - 56px)"}
        overflow={"auto"}
        minHeight={"100vh"}
      >
        <Container maxWidth={"md"}>
          <Box component={"h2"}>Chỉnh sửa truyện</Box>
          <Box className={"hr"} my={2} />
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
          <Stack direction={"row"} justifyContent={"center"}>
            <Box
              component={"img"}
              src={storyData?.result.story_cover}
              width={"300px"}
            />
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

EditStory.Layout = AdminLayout;

export default EditStory;
