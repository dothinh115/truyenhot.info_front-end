import { TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CommentFormContext } from "./form";
type Props = {
  placeholder?: string;
  disabled?: boolean;
  onClick?: any;
  name: string;
  defaultValue?: string;
};

export const FormItemInput = ({
  placeholder,
  disabled,
  onClick,
  name,
  defaultValue,
}: Props) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useFormContext();
  const { onSubmit } = useContext<any>(CommentFormContext);
  useEffect(() => {
    if (defaultValue) setValue(name, defaultValue.replaceAll("<br>", "\n"));
  }, [defaultValue]);
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "Không được để trống",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            fullWidth
            onChange={onChange}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (window.innerWidth > 430) {
                if (event.key === "Enter" || event.keyCode === 13) {
                  if (!event.altKey) {
                    event.preventDefault();
                    handleSubmit(onSubmit)();
                    reset({ [name]: "" });
                  } else {
                    setValue(name, `${value}\n`);
                  }
                }
              }
            }}
            value={value.replace(/↵/g, "\n")}
            multiline
            placeholder={placeholder}
            error={!!errors?.comment_content}
            sx={{
              backgroundColor: "myBackground.secondary",
            }}
            size="small"
            disabled={disabled}
            onClick={onClick}
          />
        )}
      />
    </>
  );
};
