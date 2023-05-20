import { Seo } from "@/components";
import { useAuth } from "@/hooks/auth";
import { LoginLayout } from "@/layouts";
import { LoginPayloadInterface } from "@/models/auth";
import { emailPatter, thumbnailUrl } from "@/utils/variables";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
type Props = {};
const emailPattern = new RegExp(emailPatter);

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
    } catch (error: any) {
      console.log(error);
      setError("password", { message: error.response?.data.message });
    }
  };

  return (
    <>
      <Seo
        data={{
          title: `Đăng nhập - truyenhot.info`,
          description: `Đăng nhập - Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info/login`,
          thumbnailUrl,
        }}
      />
      <Box component={"form"} onSubmit={handleSubmit(submitHandle)}>
        <Box
          component={"h2"}
          my={0}
          py={1}
          sx={{
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Đăng nhập
          <IconButton LinkComponent={Link} href="/" color="error">
            <CloseIcon />
          </IconButton>
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
                helperText={
                  errors.email?.message ? errors.email?.message : null
                }
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
                label={"Mật khẩu"}
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
            sx={{ textDecoration: "none", fontSize: "13px" }}
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
        <Typography
          my={1}
          sx={{
            fontSize: "13px",
            textAlign: "center",
            "& > a ": {
              textDecoration: "none",
            },
          }}
        >
          Chưa có tài khoản? <Link href={"/register"}>Đăng ký</Link>
        </Typography>
      </Box>
    </>
  );
};

Login.Layout = LoginLayout;

export default Login;
