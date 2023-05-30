import { ReportOptionInterface } from "@/models/stories";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { API } from "@/utils/config";
import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts/admin";

type Props = {};

const AdminReportNew = (props: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();

  const { data: errorOptionData, mutate: errorOptionMutate } = useSWR(
    `/stories/errorReportOption/getAll`
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ report_title: string }>({
    mode: "onSubmit",
    defaultValues: {
      report_title: "",
    },
  });
  const submitHandle = async (data: { report_title: string }) => {
    try {
      await API.post("/stories/errorReportOption/new", data);
      setSnackbar({
        open: true,
        message: "Thêm loại lỗi thành công!",
      });
      errorOptionMutate();
      reset({ report_title: "" });
    } catch (error: any) {
      setSnackbar({
        message: error.response?.data.message,
        open: true,
        type: "error",
      });
    }
  };

  const deleteHandle = async (_id: string) => {
    try {
      await API.delete(`/stories/errorReportOption/delete/${_id}`);
      setSnackbar({
        open: true,
        message: "Xóa loại lỗi thành công!",
      });
      errorOptionMutate();
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

      <Stack direction={"row"} justifyContent={"center"}>
        <Container maxWidth={"sm"}>
          <Box component={"h2"} mb={0}>
            Thêm loại lỗi mới
          </Box>
          <Box className={"hr"} my={2} />
          <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
            <Controller
              name="report_title"
              control={control}
              rules={{
                required: "Không được để trống!",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  sx={{
                    my: 2,
                  }}
                  label="Tên thể loại"
                  fullWidth
                  onChange={onChange}
                  value={value}
                  error={!!errors.report_title?.message}
                  helperText={
                    errors.report_title?.message
                      ? errors.report_title?.message
                      : null
                  }
                  size="small"
                />
              )}
            />
            <Box textAlign={"right"}>
              <Button type="submit" variant="contained">
                Thêm
              </Button>
            </Box>
          </Box>

          <Box component={"h2"}>Danh sách loại lỗi</Box>
          <Box className={"hr"} my={2} />
          <TableContainer>
            <Table size="small">
              <TableBody>
                {errorOptionData?.result.map(
                  (report: ReportOptionInterface) => {
                    return (
                      <TableRow key={report._id}>
                        <TableCell>{report.report_title}</TableCell>
                        <TableCell width={"30%"} align="right">
                          <Button
                            color="error"
                            variant="contained"
                            type="button"
                            onClick={() => deleteHandle(report._id)}
                          >
                            <DeleteForeverIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Stack>
    </>
  );
};

AdminReportNew.Layout = AdminLayout;

export default AdminReportNew;
