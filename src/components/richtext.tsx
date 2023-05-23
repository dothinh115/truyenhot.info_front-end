import { Box, alpha, Stack, IconButton, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
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

const IconButtonStyled = styled(Button)(({ theme }) => ({
  width: "30px",
  height: "30px",
  padding: "4px",
  minWidth: "unset",
  "& > svg": {
    fontSize: "1.3em",
  },
}));

export const RichTextEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
}: Props) => {
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
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
      <Stack direction={"row"} gap={"5px"} mb={"4px"} width={"100%"}>
        <IconButtonStyled
          variant={bold ? "contained" : "text"}
          size="small"
          onTouchStart={() => {
            document.execCommand("bold");
            setBold(!bold);
          }}
          onClick={() => {
            if (window.innerWidth > 428) {
              document.execCommand("bold");
              setBold(!bold);
            }
          }}
        >
          <FormatBoldIcon />
        </IconButtonStyled>
        <IconButtonStyled
          variant={italic ? "contained" : "text"}
          size="small"
          onTouchStart={() => {
            document.execCommand("italic");
            setItalic(!italic);
          }}
          onClick={() => {
            if (window.innerWidth > 428) {
              document.execCommand("italic");
              setItalic(!italic);
            }
          }}
        >
          <FormatItalicIcon />
        </IconButtonStyled>
        <IconButtonStyled
          variant={underline ? "contained" : "text"}
          size="small"
          onTouchStart={() => {
            document.execCommand("underline");
            setUnderline(!underline);
          }}
          onClick={() => {
            if (window.innerWidth > 428) {
              document.execCommand("underline");
              setUnderline(!underline);
            }
          }}
        >
          <FormatUnderlinedIcon />
        </IconButtonStyled>
      </Stack>

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
