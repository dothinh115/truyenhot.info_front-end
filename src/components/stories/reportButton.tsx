import { useSnackbar } from "@/hooks/snackbar";
import { ChapterListInterface } from "@/models/chapters";
import { NewReportInterface, ReportOptionInterface } from "@/models/stories";
import { API } from "@/utils/config";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  alpha,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { styled } from "@mui/material/styles";
type Props = {
  open: boolean;
  setOpen: any;
  story_code: string;
  chapter_code?: string;
};

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

const ModalInner = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  position: "absolute",
  backgroundColor: theme.palette.myBackground.default,
  border: `1px solid `,
  zIndex: 100,
  padding: theme.spacing(2),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  [theme.breakpoints.up("xs")]: {
    width: "90%",
  },
  [theme.breakpoints.up("md")]: {
    width: "20%",
  },
  minWidth: "350px",
}));

export const StoryReportButton = ({
  open,
  setOpen,
  story_code,
  chapter_code,
}: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();
  const { data: reportOptionData, mutate: reportOptionMutate } = useSWR(
    `/stories/errorReportOption/getAll`,
    {
      revalidateOnMount: false,
      dedupingInterval: 1000 * 60 * 60,
    }
  );

  const { data: chapterListData, mutate: chapterListMutate } = useSWR<{
    result: ChapterListInterface[];
  }>(`/chapter/getChapterListByStoryCode/${story_code}?page=all`, {
    revalidateOnMount: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewReportInterface>({
    mode: "onSubmit",
    defaultValues: {
      report_description: "",
      report_title: "",
      chapter_code: "",
    },
  });

  const submitHandle = async (data: NewReportInterface) => {
    data = {
      ...data,
      story_code,
      chapter_code: chapter_code ? chapter_code : data.chapter_code,
    };

    try {
      API.post(`/stories/errorReport/new`, data);
      setSnackbar({
        message: "Gửi lỗi thành công",
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
      setOpen(false);
    }
  };

  const openModalHandle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open && !reportOptionData) reportOptionMutate();
  }, [open]);

  useEffect(() => {
    if (story_code && open && !chapter_code) chapterListMutate();
  }, [story_code, open]);
  return (
    <>
      {snackbar}
      <Modal open={open} onClose={openModalHandle}>
        <ModalInner>
          <Box component={"h2"} p={0} m={0} sx={{ color: "myText.primary" }}>
            Report truyện lỗi
          </Box>
          <Box className="hr" my={1} />
          <Box
            component={"form"}
            onSubmit={handleSubmit(submitHandle)}
            sx={{
              "&>div": {
                mb: 2,
              },
              my: 2,
            }}
          >
            <Controller
              name={"report_title"}
              control={control}
              rules={{
                required: "Không được để trống",
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl fullWidth error={!!errors.report_title?.message}>
                  <InputLabel>Chọn lỗi</InputLabel>
                  <Select label="Chọn lỗi" value={value} onChange={onChange}>
                    {reportOptionData?.result.map(
                      (item: ReportOptionInterface) => {
                        return (
                          <MenuItem value={item.report_title} key={item._id}>
                            {item.report_title}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                  {errors.report_title?.message && (
                    <FormHelperText>
                      {errors.report_title?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            {!chapter_code && (
              <Controller
                name={"chapter_code"}
                control={control}
                rules={{
                  required: "Không được để trống",
                  maxLength: {
                    value: 99,
                    message: "Tối đa 100 ký tự!",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <FormControl fullWidth>
                    <InputLabel>Chương bị lỗi</InputLabel>
                    <Select
                      value={value}
                      onChange={onChange}
                      fullWidth
                      label="Chương bị lỗi"
                      MenuProps={MenuProps}
                    >
                      {chapterListData?.result.map(
                        (chapter: ChapterListInterface) => {
                          return (
                            <MenuItem
                              key={chapter._id}
                              value={chapter.chapter_code}
                            >
                              {chapter.chapter_name}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                  </FormControl>
                )}
              />
            )}
            <Controller
              name={"report_description"}
              control={control}
              rules={{
                maxLength: {
                  value: 99,
                  message: "Tối đa 100 ký tự!",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  multiline
                  label="Mô tả lỗi"
                  value={value}
                  onChange={onChange}
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  sx={{ mb: 2 }}
                  error={!!errors.report_description?.message}
                  helperText={
                    errors.report_description?.message
                      ? errors.report_description?.message
                      : "Mô tả ngắn gọn về lỗi."
                  }
                />
              )}
            />
            <Button
              color={"success"}
              fullWidth
              size="small"
              variant="contained"
              type="submit"
            >
              Gửi
            </Button>
          </Box>
          <Box
            sx={{
              color: "myText.primary",
            }}
          >
            Bọn mình rất cảm ơn về báo cáo của bạn!
          </Box>

          <Box className="hr" my={1} />
          <Box textAlign={"right"}>
            <IconButton
              sx={{
                width: "40px",
                height: "40px",
                "& svg": {
                  color: "rgba(255, 0, 0, .8)",
                },
                p: 0,
              }}
              onClick={openModalHandle}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalInner>
      </Modal>
      <Button
        color={"error"}
        startIcon={<ReportIcon />}
        onClick={openModalHandle}
      >
        Báo cáo lỗi
      </Button>
    </>
  );
};
