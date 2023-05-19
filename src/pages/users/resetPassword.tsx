import { LoginLayout } from "@/layouts";
import {
  Box,
  Divider,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useRouter } from "next/router";
import { API } from "@/utils/config";
type Props = {};

const ResetPassword = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [showReset, setShowReset] = useState<boolean>(false);

  const router = useRouter();
  const { token } = router.query;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit: rsHandleSubmit,
    control: rsControl,
    watch,
    formState: { errors: rsErrors, isSubmitting: rsIsSubmitting },
  } = useForm<{ password: string; passwordConfirm: string }>({
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const submitHandle = async (data: { email: string }) => {
    try {
      await API.get(`/userResetPassword/${data.email}`);
      setMessage(
        "Link dùng để đặt lại password đã được gửi đến email của bạn, hãy kiểm tra trong vòng 1 - 2 phút tới."
      );
    } catch (error: any) {
      setMessage(error.response?.data.message);
    }
  };

  const rsSubmitHandle = async (data: {
    password: string;
    passwordConfirm: string;
  }) => {
    try {
      const respone: any = await API.post(`/resetPasswordRequest/${token}`, {
        password: data.password,
      });
      setMessage(respone.result);
      setShowReset(false);
    } catch (error: any) {
      setMessage(error.response?.data.message);
    }
  };

  const resetPasswordRequest = async () => {
    try {
      await API.get(`/resetPassword/${token}`);
      setShowReset(true);
    } catch (error: any) {
      setMessage(error.response?.data.message);
      setShowReset(false);
    }
  };

  useEffect(() => {
    if (token) resetPasswordRequest();
  }, [token]);

  return (
    <Box
      component={"form"}
      onSubmit={
        showReset ? rsHandleSubmit(rsSubmitHandle) : handleSubmit(submitHandle)
      }
    >
      <Box
        component={"h2"}
        sx={{
          color: "myText.primary",
        }}
        m={0}
      >
        {showReset ? "Đặt lại mật khẩu " : "Quên mật khẩu"}
      </Box>
      <Divider />
      {showReset ? (
        <>
          <Controller
            name={"password"}
            control={rsControl}
            rules={{
              required: "Không được để trống",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                type="password"
                fullWidth
                label={"Password"}
                onChange={onChange}
                value={value}
                error={!!rsErrors?.password}
                helperText={
                  rsErrors.password?.message ? rsErrors.password?.message : null
                }
                sx={{ my: 1 }}
                size="small"
              />
            )}
          />
          <Controller
            name={"passwordConfirm"}
            control={rsControl}
            rules={{
              required: "Không được để trống",
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return "Nhập lại mật khẩu không đúng";
                }
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                type="password"
                fullWidth
                label={"Nhập lại password"}
                onChange={onChange}
                value={value}
                error={!!rsErrors?.passwordConfirm}
                helperText={
                  rsErrors.passwordConfirm?.message
                    ? rsErrors.passwordConfirm?.message
                    : null
                }
                sx={{ my: 1 }}
                size="small"
              />
            )}
          />
          <Divider />
          <Box textAlign={"right"} my={1}>
            <Button
              color="success"
              type="submit"
              size="small"
              variant="contained"
              endIcon={<ArrowCircleRightIcon />}
            >
              Đặt lại
            </Button>
          </Box>
        </>
      ) : message ? (
        <Box my={2}>{message}</Box>
      ) : (
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignContent={"center"}
        >
          <Controller
            name={"email"}
            control={control}
            rules={{
              required: "Không được để trống",
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
                sx={{ my: 1 }}
                size="small"
              />
            )}
          />
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton color="success" type="submit">
              <ArrowCircleRightIcon />
            </IconButton>
          </Stack>
        </Stack>
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

ResetPassword.Layout = LoginLayout;

export default ResetPassword;
