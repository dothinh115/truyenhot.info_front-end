import { Box, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef } from "react";
type Props = {
  cb: (data: string) => void;
  clicked: boolean;
  setClicked: (state: boolean) => any;
  placeholder?: string;
  defaultValue?: string;
};

const ContentEditableStyled = styled(Box)(({ theme }) => ({
  border: `1px solid ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  backgroundColor: theme.palette.myBackground.paper,
  borderRadius: theme.spacing(0.5),
  minHeight: theme.spacing(4),
  outline: "none",
  color: "myText.primary",
  padding: theme.spacing(1),
  [theme.breakpoints.up("xs")]: {
    fontSize: "16px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
}));

export const RichTextEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
}: Props) => {
  const contentDiv = useRef<HTMLDivElement>();
  const keyDown = (event: any) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      if (event.altKey || event.shiftKey) {
        document.execCommand("insertLineBreak");
      } else {
        if (contentDiv?.current !== undefined) {
          const content = contentDiv.current?.innerHTML;
          cb(content);
          contentDiv.current!.innerHTML = "";
        }
      }
    }
  };

  useEffect(() => {
    if (contentDiv?.current !== undefined) {
      cb(contentDiv.current?.innerHTML);
      contentDiv.current!.innerHTML = "";
      setClicked(false);
    }
  }, [clicked]);

  useEffect(() => {
    if (defaultValue && contentDiv?.current)
      contentDiv!.current!.innerHTML = defaultValue;
  }, [defaultValue]);

  return (
    <>
      <Box flexGrow={1}>
        <ContentEditableStyled
          contentEditable={true}
          tabIndex={0}
          onKeyDown={keyDown}
          ref={contentDiv}
          data-placeholder={placeholder}
        ></ContentEditableStyled>
      </Box>
    </>
  );
};
