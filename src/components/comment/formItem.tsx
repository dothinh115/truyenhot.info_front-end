import { TextField } from "@mui/material";
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
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useFormContext();
  const { onSubmit } = useContext<any>(CommentFormContext);
  const inputEle = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (defaultValue) setValue(name, defaultValue.replaceAll("<br>", "\n"));
  }, [defaultValue]);
  return (
    <>
      <TextField
        fullWidth
        inputRef={inputEle}
        onChange={(event) => {
          let { value } = event.target;
          if (value === "") {
            setError(name, { message: "Không được để trống" });
          } else {
            clearErrors(name);
            setValue(name, value);
          }
        }}
        onKeyDown={(event: any) => {
          let { value } = event.target;
          if (window.innerWidth > 430) {
            if (event.key === "Enter" || event.keyCode === 13) {
              if (!event.altKey) {
                event.preventDefault();
                if (!errors[name]) {
                  value = "";
                  handleSubmit(onSubmit)();
                  reset({ [name]: "" });
                }
              } else {
                const cursorPos = inputEle?.current!.selectionStart;
                const textBefore = value.substr(0, cursorPos);
                const textAfter = value.substr(cursorPos, value.length);
                event.target.value = `${textBefore}\n${textAfter}`;
                event.target.style.overflow = "auto";
                event.target.setSelectionRange(cursorPos + 1, cursorPos + 1);
                event.target.blur();
                event.target.focus();
              }
            }
          }
        }}
        multiline
        placeholder={placeholder}
        error={!!errors?.[name]}
        sx={{
          backgroundColor: "myBackground.secondary",
        }}
        size="small"
        maxRows={5}
        disabled={disabled}
        onClick={onClick}
      />
    </>
  );
};
