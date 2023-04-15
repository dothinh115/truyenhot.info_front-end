import { LoginLayout } from "@/layouts";
import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

type Props = {};

type LoginType = {
  email: string;
  password: string;
};

const Login = (props: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginType>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandle = async (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandle)}>
      <Box
        component={"h1"}
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
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              fullWidth
              label={"Email"}
              onChange={onChange}
              value={value}
              error={!!errors?.email}
              helperText={errors.email?.message ? errors.email?.message : null}
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
              error={!!errors?.password}
              helperText={
                errors.password?.message ? errors.password?.message : null
              }
            />
          )}
        />
      </Box>
      <Box textAlign={"right"}>
        <Button color="success" type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  );
};

Login.Layout = LoginLayout;

export default Login;
