import { LoginLayout } from "@/layouts";
import { API } from "@/utils/config";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
        my={0}
        py={1}
        sx={{
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {showReset ? "Đặt lại mật khẩu " : "Quên mật khẩu"}
        <IconButton LinkComponent={Link} href="/">
          <CloseIcon />
        </IconButton>
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

          <Button
            color="success"
            type="submit"
            size="small"
            variant="contained"
            endIcon={<ArrowCircleRightIcon />}
            fullWidth
          >
            Đặt lại
          </Button>
        </>
      ) : message ? (
        <Box my={2} fontSize={"13px"}>
          {message}
        </Box>
      ) : (
        <Stack>
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
                  errors.email?.message
                    ? errors.email?.message
                    : "Nhập email đã đăng ký"
                }
                sx={{ my: 1 }}
                size="small"
              />
            )}
          />
          <Button fullWidth size="small" color="success" variant="contained">
            Gửi
          </Button>
        </Stack>
      )}

      <Box
        my={1}
        sx={{
          fontSize: "13px",
        }}
      >
        <Divider sx={{ my: 2 }} />
        Bạn có thể dùng mẫu sau để đặt lại mật khẩu, bạn sẽ nhận được một email
        với nội dung hướng dẫn đặt lại mật khẩu.
      </Box>
    </Box>
  );
};

ResetPassword.Layout = LoginLayout;

export default ResetPassword;
