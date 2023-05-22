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
      <Box
        component={"form"}
        sx={sx}
        onSubmit={() =>
          handleSubmit(() => {
            onSubmit();
            reset(defaultValues);
          })
        }
      >
        <CommentFormContext.Provider value={{ onSubmit }}>
          <FormProvider {...methods}>{children}</FormProvider>
        </CommentFormContext.Provider>
      </Box>
    </>
  );
};
