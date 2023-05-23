import React, { ReactNode, createContext } from "react";
import { Box } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  defaultValues: any;
  children: ReactNode;
  onSubmit: any;
  sx?: any;
};

export const CommentFormContext = createContext({});

export const Form = ({ defaultValues, children, onSubmit, sx }: Props) => {
  const methods = useForm<any>({
    mode: "onChange",
    defaultValues,
  });
  const { handleSubmit, reset } = methods;
  return (
    <>
      <Box component={"form"} sx={sx} onSubmit={handleSubmit(onSubmit)}>
        <CommentFormContext.Provider value={{ onSubmit }}>
          <FormProvider {...methods}>{children}</FormProvider>
        </CommentFormContext.Provider>
      </Box>
      <Box
        sx={{
          width: "100%",
          color: "myText.primary",
          fontSize: ".8em",
          marginLeft: "8px",
        }}
      >
        Alt + Enter để xuống hàng
      </Box>
    </>
  );
};
