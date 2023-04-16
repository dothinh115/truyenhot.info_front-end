import { AdminLayout } from "@/layouts";
import React from "react";
import {
  Stack,
  Container,
  Box,
  TextField,
  Button,
  AutocompleteGetTagProps,
  autocompleteClasses,
  useAutocomplete,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { NewStoryInterface } from "@/models";
import CheckIcon from "@mui/icons-material/Check";
import useSWR from "swr";
import { InputWrapper, Listbox, Root, StyledTag } from "@/style/autoselectBox";

type Props = {};

interface CategoryInterface {
  cate_id: number;
  cate_title: string;
}

const newStoryShape: NewStoryInterface = {
  story_title: "",
  story_author: "",
  story_category: "",
  story_description: "",
  story_source: "",
};

const AdminNewStories = (props: Props) => {
  const { data: categoriesList } = useSWR("/categories/getAll");

  const {
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
  } = useAutocomplete({
    defaultValue: [],
    multiple: true,
    options: categoriesList?.result ? [...categoriesList.result] : [],
    getOptionLabel: (option) => option.cate_title,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewStoryInterface>({
    mode: "onChange",
    defaultValues: newStoryShape,
  });

  const newStorySubmitHandle = (data: any) => {
    let cateList: CategoryInterface[] = [];
    for (let cate of value) {
      cateList = [...cateList, cate.cate_id];
    }
    console.log({
      ...data,
      story_category: cateList.join(","),
    });
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

              <Root>
                <InputWrapper className={focused ? "focused" : ""}>
                  {value.map((option: CategoryInterface, index: number) => (
                    <StyledTag
                      label={option.cate_title}
                      {...getTagProps({ index })}
                    />
                  ))}
                  <input {...getInputProps()} />
                </InputWrapper>
                {groupedOptions.length > 0 ? (
                  <Listbox {...getListboxProps()}>
                    {(groupedOptions as typeof categoriesList).map(
                      (option: CategoryInterface, index: number) => (
                        <li {...getOptionProps({ option, index })}>
                          <span>{option.cate_title}</span>
                          <CheckIcon fontSize="small" />
                        </li>
                      )
                    )}
                  </Listbox>
                ) : null}
              </Root>

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
