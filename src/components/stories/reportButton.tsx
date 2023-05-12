import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  FormHelperText,
} from "@mui/material";
import useSWR from "swr";
import { useEffect } from "react";
import { ReportInterface, ReportOptionInterface } from "@/models/stories";
import { Controller, useForm } from "react-hook-form";
import { API } from "@/utils/config";
import { useSnackbar } from "@/hooks/snackbar";
type Props = {
  open: boolean;
  setOpen: any;
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

export const StoryReportButton = ({ open, setOpen }: Props) => {
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
  } = useForm<ReportInterface>({
    mode: "onSubmit",
    defaultValues: {
      report_description: "",
      report_title: "",
    },
  });

  const submitHandle = async (data: ReportInterface) => {
    try {
      const respone = API.post(`/stories/errorReport/new`, data);
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
                          <MenuItem value={item._id} key={item._id}>
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
                      : null
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
      <Box
        component={Button}
        size="small"
        variant="contained"
        color={"info"}
        onClick={openModalHandle}
      >
        Report truyện lỗi
      </Box>
    </>
  );
};
