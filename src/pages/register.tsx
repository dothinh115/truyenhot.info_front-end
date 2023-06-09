import { API } from "@/utils/config";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { emailPattern, thumbnailUrl, user_idPattern } from "@/utils/variables";
import { Seo } from "@/components/seo";
import { LoginLayout } from "@/layouts/login";
import { useRouter } from "next/router";

type Props = {};

const emailPatternExp = new RegExp(emailPattern);

const user_idPatternExp = new RegExp(user_idPattern);

const Register = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    getValues,
    watch,
  } = useForm<{
    email: string;
    user_id: string;
    password: string;
    gender: "male" | "female";
    passwordConfirm: string;
  }>({
    mode: "onChange",
    defaultValues: {
      email: "",
      user_id: "",
      password: "",
      gender: "male",
      passwordConfirm: "",
    },
  });

  const router = useRouter();

  const { goAround } = router.query;

  const submitHandle = async (data: {
    email: string;
    user_id: string;
    password: string;
    gender: string;
  }) => {
    try {
      await API.post(`/signUp`, data);
      setMessage(
        `Bạn cần kích hoạt tài khoản trước sử dụng, link kích hoạt sẽ được gửi đến email ${data.email} sau 1 - 2 phút. `
      );
      setCountdown(60);
    } catch (error: any) {
      setError(error.response?.data.result.key, {
        message: error.response?.data.result.message,
      });
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
    <>
      <Seo
        data={{
          title: `Đăng ký - truyenhot.info`,
          description: `Đăng ký - Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info/login`,
          thumbnailUrl,
        }}
      />
      <Box
        component={"form"}
        onSubmit={handleSubmit(submitHandle)}
        sx={{
          "&>div": {
            mb: 1,
          },
        }}
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
          <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
            <IconButton onClick={() => router.push("/login")}>
              <ArrowBackIcon />
            </IconButton>
            Đăng ký
          </Stack>
          <IconButton
            onClick={() => {
              goAround ? router.back() : router.push("/");
            }}
            color="error"
          >
            <CloseIcon />
          </IconButton>
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
            <Controller
              name={"user_id"}
              control={control}
              rules={{
                required: "Không được để trống!",
                maxLength: {
                  value: 15,
                  message: "Tối đa 15 ký tự.",
                },
                pattern: {
                  value: user_idPatternExp,
                  message:
                    "Bạn chỉ cần điền ký tự và số, không cần @, và không có khoảng trắng.",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  fullWidth
                  label={"Tên"}
                  onChange={onChange}
                  inputProps={{ maxLength: 15 }}
                  value={value}
                  error={!!errors?.user_id}
                  helperText={
                    errors.user_id?.message
                      ? errors.user_id?.message
                      : "Đây là tên sẽ hiển thị khi bạn bình luận, ví dụ như alex sẽ hiển thị là @alex, bạn không cần phải điền ký tự @"
                  }
                  size="small"
                />
              )}
            />

            <Controller
              name={"email"}
              control={control}
              rules={{
                required: "Không được để trống",
                pattern: {
                  value: emailPatternExp,
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

            <Controller
              name={"gender"}
              control={control}
              rules={{
                required: "Không được để trống",
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <Select
                    value={value}
                    onChange={onChange}
                    size="small"
                    fullWidth
                    error={!!errors?.gender}
                  >
                    <MenuItem value={"male"}>Nam</MenuItem>
                    <MenuItem value={"female"}>Nữ</MenuItem>
                  </Select>
                </>
              )}
            />

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
            <Controller
              name={"passwordConfirm"}
              control={control}
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
                  label={"Nhập lại mật khẩu"}
                  onChange={onChange}
                  value={value}
                  error={!!errors?.passwordConfirm}
                  helperText={
                    errors.passwordConfirm?.message
                      ? errors.passwordConfirm?.message
                      : null
                  }
                  size="small"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isSubmitting ? true : false}
              color="success"
              fullWidth
              startIcon={
                isSubmitting ? (
                  <CircularProgress color="inherit" size={"1em"} />
                ) : null
              }
              sx={{
                my: 1,
              }}
            >
              Đăng ký
            </Button>
          </>
        )}
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
          Đã có tài khoản? <Link href={"/login"}>Đăng nhập</Link>
        </Typography>
      </Box>
    </>
  );
};

Register.Layout = LoginLayout;

export default Register;
