import { useAuth } from "@/hooks/auth";
import { LoginLayout } from "@/layouts";
import { LoginPayloadInterface } from "@/models/auth";
import { Box, Button, TextField, Stack, Divider } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Props = {};

const emailPattern = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

const Login = (props: Props) => {
  const { login } = useAuth({
    revalidateOnMount: false,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginPayloadInterface>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandle = async (data: any) => {
    try {
      await login(data);
    } catch (error) {
      console.log(error);
      setError("password", { message: "Email hoặc password không đúng!" });
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
      <Box
        component={"h2"}
        m={0}
        mb={1}
        sx={{
          borderBottom: "1px solid #eee",
        }}
      >
        Đăng nhập
      </Box>
      <Box py={1}>
        <Controller
          name={"email"}
          control={control}
          rules={{
            required: "Không được để trống",
            pattern: {
              value: emailPattern,
              message: "Email phải đúng định dạng!",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              label={"Email"}
              onChange={onChange}
              value={value}
              error={!!errors?.email}
              helperText={errors.email?.message ? errors.email?.message : null}
              size="small"
            />
          )}
        />
      </Box>
      <Box py={1}>
        <Controller
          name={"password"}
          control={control}
          rules={{
            required: "Không được để trống",
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              type="password"
              label={"Password"}
              onChange={onChange}
              value={value}
              error={!!errors.password?.message}
              helperText={
                errors.password?.message ? errors.password?.message : null
              }
              size="small"
            />
          )}
        />
      </Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        my={1}
        alignItems={"center"}
      >
        <Box
          component={Link}
          href={"/users/resetPassword"}
          sx={{ textDecoration: "none" }}
        >
          Quên mật khẩu
        </Box>
        <Button
          type="submit"
          variant="contained"
          size="small"
          color="success"
          disabled={isSubmitting ? true : false}
          startIcon={
            isSubmitting ? (
              <CircularProgress color="inherit" size={"1em"} />
            ) : null
          }
        >
          Đăng nhập
        </Button>
      </Stack>
      <Divider />
      <Button
        LinkComponent={Link}
        href="/"
        variant="contained"
        sx={{ mt: 1 }}
        startIcon={<ArrowBackIcon color="inherit" />}
        size="small"
        fullWidth
      >
        Về trang chủ
      </Button>
    </Box>
  );
};

Login.Layout = LoginLayout;

export default Login;
