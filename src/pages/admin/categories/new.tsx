import { useSnackbar } from "@/hooks/snackbar";
import { AdminLayout } from "@/layouts";
import { API } from "@/utils/config";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

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
  const { data: categoriesData, mutate } = useSWR("/categories/getAll");

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

  return (
    <>
      {snackbar}

      <Stack direction={"row"} justifyContent={"center"}>
        <Container maxWidth={"sm"}>
          <Box
            component={"h2"}
            sx={{
              pb: 1,
              borderBottom: "1px solid #ccc",
            }}
          >
            Thêm thể loại mới
          </Box>
          <Box>
            <form onSubmit={handleSubmit(submitHandle)}>
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
            </form>
          </Box>

          <Box
            sx={{
              mt: 4,
            }}
          >
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
