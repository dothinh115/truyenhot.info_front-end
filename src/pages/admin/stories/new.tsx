import { AdminLayout } from "@/layouts";
import React from "react";
import { Stack, Container, Box, TextField, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NewStoryInterface } from "@/models";

type Props = {};

const newStoryShape: NewStoryInterface = {
  story_title: "",
  story_author: "",
  story_category: "",
  story_description: "",
  story_source: "",
  cover_img: "",
};

const AdminNewStories = (props: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewStoryInterface>({
    mode: "onChange",
    defaultValues: newStoryShape,
  });

  const newStorySubmitHandle = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Stack component={"div"} flexDirection={"row"} justifyContent={"center"}>
        <Container maxWidth={"sm"}>
          <Box
            component={"h2"}
            sx={{
              borderBottom: "1px solid #ccc",
              pb: 2,
            }}
          >
            Đăng truyện mới
          </Box>
          <Box>
            <form onSubmit={handleSubmit(newStorySubmitHandle)}>
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
                  <TextField
                    sx={{
                      mb: 1,
                    }}
                    multiline
                    rows={4}
                    fullWidth
                    type="text"
                    label={"Mô tả ngắn"}
                    onChange={onChange}
                    value={value}
                    error={!!errors.story_description?.message}
                    helperText={
                      errors.story_description?.message
                        ? errors.story_description?.message
                        : null
                    }
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
                rules={{
                  required: "Không được để trống",
                }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    sx={{
                      mb: 1,
                    }}
                    fullWidth
                    type="text"
                    label={"Thể loại"}
                    onChange={onChange}
                    value={value}
                    error={!!errors.story_category?.message}
                    helperText={
                      errors.story_category?.message
                        ? errors.story_category?.message
                        : null
                    }
                  />
                )}
              />
              <Stack flexDirection={"row"} justifyContent={"flex-end"}>
                <Button type="submit" variant="contained">
                  Đăng
                </Button>
              </Stack>
            </form>
          </Box>
        </Container>
      </Stack>
    </>
  );
};

AdminNewStories.Layout = AdminLayout;

export default AdminNewStories;
