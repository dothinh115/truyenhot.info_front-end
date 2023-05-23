import { TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
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
    formState: { isSubmitting },
  } = useFormContext();
  const { onSubmit } = useContext<any>(CommentFormContext);
  const inputEle = useRef<HTMLTextAreaElement>(null);
  const [val, setVal] = useState<string>("");

  useEffect(() => {
    if (defaultValue) defaultValue = defaultValue.replaceAll("<br>", "\n");
  }, [defaultValue]);

  useEffect(() => {
    setValue(name, val);
  }, [val]);

  useEffect(() => {
    if (isSubmitting) {
      inputEle!.current!.value = "";
      setVal("");
    }
  }, [isSubmitting]);

  return (
    <>
      <TextField
        fullWidth
        inputRef={inputEle}
        onChange={(event) => {
          let { value } = event.target;
          setVal(value);
        }}
        onKeyDown={(event: any) => {
          let { value } = event.target;
          if (window.innerWidth > 430) {
            if (event.key === "Enter" || event.keyCode === 13) {
              if (!event.altKey) {
                event.preventDefault();
                if (value !== "") {
                  event.target.value = "";
                  handleSubmit(onSubmit)();
                  setVal("");
                } else {
                  setVal("");
                }
              } else {
                const cursorPos = inputEle?.current!.selectionStart;
                const textBefore = value.substr(0, cursorPos);
                const textAfter = value.substr(cursorPos, value.length);
                event.target.value = `${textBefore}\n${textAfter}`;
                setVal(`${textBefore}\n${textAfter}`);
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
        sx={{
          backgroundColor: "myBackground.secondary",
        }}
        size="small"
        maxRows={5}
        disabled={disabled}
        onClick={onClick}
        defaultValue={defaultValue}
      />
    </>
  );
};
