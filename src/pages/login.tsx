import { LoginLayout } from "@/layouts";
import { API } from "@/utils/config";
import { Box, Button, TextField } from "@mui/material";
import React from "react";
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
    const result = await API.post("/signIn", data);
    console.log(result);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitHandle)}>
        <Controller
          name={"email"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField onChange={onChange} value={value} label={"Email"} />
          )}
        />
        <Controller
          name={"password"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField onChange={onChange} value={value} label={"Password"} />
          )}
        />
        <Button color="success" type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </>
  );
};

Login.Layout = LoginLayout;

export default Login;
