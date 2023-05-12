import { useSnackbar } from "@/hooks/snackbar";
import { NewReportInterface, ReportOptionInterface } from "@/models/stories";
import { API } from "@/utils/config";
import CloseIcon from "@mui/icons-material/Close";
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
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import ReportIcon from "@mui/icons-material/Report";
type Props = {
  open: boolean;
  setOpen: any;
  story_code: string;
};

const style = {
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "6px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    md: "20%",
    xs: "90%",
  },
  p: 2,
};

export const StoryReportButton = ({ open, setOpen, story_code }: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();
  const { data: reportOptionData, mutate: reportOptionMutate } = useSWR(
    `/stories/errorReportOption/getAll`,
    {
      revalidateOnMount: false,
      dedupingInterval: 1000 * 60 * 60,
    }
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewReportInterface>({
    mode: "onSubmit",
    defaultValues: {
      report_description: "",
      report_title: "",
    },
  });

  const submitHandle = async (data: NewReportInterface) => {
    data = {
      ...data,
      story_code,
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
  return (
    <>
      {snackbar}
      <Modal open={open} onClose={openModalHandle}>
        <Box sx={style}>
          <Box component={"h2"} p={0} m={0}>
            Report truyện lỗi
          </Box>
          <Box className="hr" my={1} />
          <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
            <Controller
              name={"report_title"}
              control={control}
              rules={{
                required: "Không được để trống",
              }}
              render={({ field: { onChange, value } }) => (
                <FormControl
                  fullWidth
                  error={!!errors.report_title?.message}
                  sx={{ mb: 2 }}
                >
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

            <Controller
              name={"report_description"}
              control={control}
              rules={{
                required: "Không được để trống",
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
                      : "Mô tả ngắn gọn về lỗi, ví dụ như chương nào bị trống."
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
        </Box>
      </Modal>
      <Button
        startIcon={<ReportIcon />}
        variant="outlined"
        color={"error"}
        onClick={openModalHandle}
        size="small"
      >
        Báo cáo lỗi
      </Button>
    </>
  );
};
