import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout, AdminLayoutContext } from "@/layouts";
import { API } from "@/utils/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Stack from "@mui/material/Stack";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Container from "@mui/system/Container";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import React, { useContext, useEffect } from "react";
type Props = {};

interface NewCategoryInterface {
  cate_title: string;
}

interface CategoryDataInterface {
  cate_id: number;
  cate_title: string;
}

const NewCategory = (props: Props) => {
  const { snackbar, setSnackbar } = useSnackbar();
  const {
    data: categoriesData,
    mutate,
    isLoading,
  } = useSWR("/categories/getAll");
  const { setLoading } = useContext<any>(AdminLayoutContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewCategoryInterface>({
    mode: "onChange",
    defaultValues: {
      cate_title: "",
    },
  });

  const submitHandle = async (data: any) => {
    try {
      await API.post("/categories/new", data);
      await mutate();
      setSnackbar({
        open: true,
        message: "Thêm thể loại thành công!",
      });
      reset({
        cate_title: "",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data.message,
        type: "error",
      });
    }
  };

  const deleteHandle = async (cate_id: number) => {
    try {
      await API.delete(`/categories/delete/${cate_id}`);
      await mutate();
      setSnackbar({
        open: true,
        message: "Xóa thể loại thành công!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      {snackbar}

      <Stack direction={"row"} justifyContent={"center"}>
        <Container maxWidth={"sm"}>
          <Box component={"h2"} my={1}>
            Thêm thể loại mới
          </Box>
          <Box className={"hr"} />
          <Box>
            <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
              <Controller
                name="cate_title"
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
                    error={!!errors.cate_title?.message}
                    helperText={
                      errors.cate_title?.message
                        ? errors.cate_title?.message
                        : null
                    }
                  />
                )}
              />
              <Box textAlign={"right"}>
                <Button type="submit" variant="contained">
                  Thêm
                </Button>
              </Box>
            </Box>
          </Box>
          <Box className={"hr"} my={2} />
          <Box>
            <Box
              component={"h2"}
              sx={{
                pb: 1,
                borderBottom: "1px solid #ccc",
              }}
            >
              Thể loại đã thêm
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={"30%"}>ID</TableCell>
                    <TableCell>Thể loại</TableCell>
                    <TableCell width={"10%"}>Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoriesData?.result.map(
                    (category: CategoryDataInterface) => {
                      return (
                        <TableRow key={category.cate_id}>
                          <TableCell>{category.cate_id}</TableCell>
                          <TableCell>{category.cate_title}</TableCell>
                          <TableCell>
                            <Button
                              color="error"
                              variant="contained"
                              type="button"
                              onClick={() => deleteHandle(category.cate_id)}
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
          </Box>
        </Container>
      </Stack>
    </>
  );
};

NewCategory.Layout = AdminLayout;

export default NewCategory;
