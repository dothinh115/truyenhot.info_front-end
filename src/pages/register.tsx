import { LoginLayout } from "@/layouts";
import { API } from "@/utils/config";
import { Box, Button, Divider, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Props = {};
const emailPattern = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);

const Register = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<{
    email: string;
    user_name: string;
    password: string;
  }>({
    mode: "onChange",
    defaultValues: {
      email: "",
      user_name: "",
      password: "",
    },
  });

  const submitHandle = async (data: {
    email: string;
    user_name: string;
    password: string;
  }) => {
    try {
      await API.post(`/signUp`, data);
      setMessage(
        `Bạn cần kích hoạt tài khoản trước sử dụng, link kích hoạt sẽ được gửi đến email ${data.email} sau 1 - 2 phút. `
      );
      setCountdown(60);
    } catch (error: any) {
      setError("email", { message: error.response?.data.message });
    }
  };

  const countDown = () => {
    if (countdown <= 0) return;
    const countdownInterval = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  };

  const resendActiveRequest = async () => {
    try {
      await API.get(`resendActiveToken/${getValues("email")}`);
      setCountdown(60);
    } catch (error: any) {
      setError("email", { message: error.response?.data.message });
    }
  };

  useEffect(() => {
    countDown();
  }, [countdown]);

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
        Đăng ký
      </Box>
      {message ? (
        <Box my={2}>
          {message}
          <Button
            fullWidth
            size="small"
            variant="contained"
            sx={{ mt: 1 }}
            color="success"
            disabled={countdown !== 0 ? true : false}
            onClick={() => resendActiveRequest()}
          >
            Gửi lại link kích hoạt ({countdown})
          </Button>
        </Box>
      ) : (
        <>
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
              name={"user_name"}
              control={control}
              rules={{
                required: "Không được để trống",
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  label={"Username"}
                  onChange={onChange}
                  value={value}
                  error={!!errors?.user_name}
                  helperText={
                    errors.user_name?.message ? errors.user_name?.message : null
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
          <Divider />
          <Box textAlign={"right"} my={1}>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isSubmitting ? true : false}
              color="success"
              startIcon={
                isSubmitting ? (
                  <CircularProgress color="inherit" size={"1em"} />
                ) : null
              }
            >
              Đăng ký
            </Button>
          </Box>
        </>
      )}
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

Register.Layout = LoginLayout;

export default Register;
