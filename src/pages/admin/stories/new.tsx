import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts";
import { NewStoryInterface } from "@/models";
import { CategoryInterface } from "@/models/categories";
import { StoryInterface } from "@/models/stories";
import { InputWrapper, Listbox, Root, StyledTag } from "@/style/autoselectBox";
import { API } from "@/utils/config";
import CheckIcon from "@mui/icons-material/Check";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
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
  TextField,
  useAutocomplete,
} from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

type Props = {};

interface NewStoryByUrlInterface {
  url: string;
}

const newStoryShape: NewStoryInterface = {
  story_title: "",
  story_author: "",
  story_category: "",
  story_description: "",
  story_source: "",
};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const AdminNewStories = (props: Props) => {
  const { data: categoriesList } = useSWR("/categories/getAll");
  const { data: storiesList, mutate } = useSWR("/stories/getAll");
  const { snackbar, setSnackbar } = useSnackbar();

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
    formState: { errors: urlErrors },
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
      for (let cate of value) {
        cateList = [...cateList, cate.cate_id];
      }
      const newData = {
        ...data,
        story_category: cateList.join(","),
        story_description: data.story_description.replaceAll(/\n/g, "<br />"),
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
      await mutate();
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

  const deleteHandle = async (story_id: number) => {
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
    }
  };

  const newStoryByUrlSubmitHanle = async (data: any) => {
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
      mutate();
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
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
        maxHeight={"calc(100vh - 56px)"}
        overflow={"auto"}
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

            <Root>
              <InputWrapper className={focused ? "focused" : ""}>
                {value.map((option: CategoryInterface, index: number) => (
                  <Box component={"span"} key={option.cate_id}>
                    <StyledTag
                      label={option.cate_title}
                      {...getTagProps({ index })}
                    />
                  </Box>
                ))}
                <Box component={"input"} {...getInputProps()} />
              </InputWrapper>
              {groupedOptions.length > 0 ? (
                <Listbox {...getListboxProps()}>
                  {(groupedOptions as typeof categoriesList).map(
                    (option: CategoryInterface, index: number) => (
                      <li
                        key={option.cate_id}
                        {...getOptionProps({ option, index })}
                      >
                        <span>{option.cate_title}</span>
                        <CheckIcon fontSize="small" />
                      </li>
                    )
                  )}
                </Listbox>
              ) : null}
            </Root>

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
              <Button type="submit" variant="contained">
                Đăng
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              mt: 4,
            }}
          >
            <Box component={"h2"}>Đăng gần đây</Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={"50px"}>Cover</TableCell>
                    <TableCell>Tên truyện</TableCell>
                    <TableCell width={"20%"}>Tác giả</TableCell>
                    <TableCell width={"10%"}>Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storiesList?.result.map((story: StoryInterface) => {
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
                            component={Link}
                            href={`/story/${story.story_code}`}
                            sx={{
                              textDecoration: "none",
                            }}
                          >
                            {story.story_title}
                          </Box>
                        </TableCell>
                        <TableCell>{story.story_author}</TableCell>
                        <TableCell>
                          <Button
                            color="error"
                            variant="contained"
                            type="button"
                            onClick={() => deleteHandle(story.story_id)}
                          >
                            <DeleteForeverIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Stack>
    </>
  );
};

AdminNewStories.Layout = AdminLayout;

export default AdminNewStories;
