import { TextField, Box } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
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
  const inputEle = useRef<HTMLDivElement>(null);
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
            ref={inputEle}
            onChange={onChange}
            onKeyDown={(event: any) => {
              if (window.innerWidth > 430) {
                if (event.key === "Enter" || event.keyCode === 13) {
                  if (event.altKey) {
                    event.preventDefault();
                    handleSubmit(onSubmit)();
                    reset({ [name]: "" });
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
