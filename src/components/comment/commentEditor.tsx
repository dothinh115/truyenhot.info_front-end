import { Box, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DraftHandleValue,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
  convertFromRaw,
  convertToRaw,
  getDefaultKeyBinding,
} from "draft-js";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  cb: (data: string) => void;
  clicked: boolean;
  setClicked: (state: boolean) => any;
  placeholder?: string;
  defaultValue?: string;
};

const ContentEditableStyled = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  "&> .DraftEditor-root": {
    border: `1px solid ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
    backgroundColor: theme.palette.myBackground.paper,
    borderRadius: theme.spacing(0.5),
    minHeight: theme.spacing(4),
    outline: "none",
    color: theme.palette.myText.primary,
    padding: theme.spacing(1),
    [theme.breakpoints.up("xs")]: {
      fontSize: theme.spacing(2),
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
  },
}));

export const CommentEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
}: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef<any>();

  const myKeyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.key === "Enter") {
      if (e.altKey || e.shiftKey) {
        return "break-line";
      } else {
        return "send-cmt";
      }
    }
    return getDefaultKeyBinding(e);
  };

  const sendCmt = () => {
    const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    cb(value);
  };

  const clearContent = () => {
    const contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const lastBlock = contentState.getLastBlock();
    const allSelected = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getLength(),
      hasFocus: true,
    });
    const removeRange = Modifier.removeRange(
      contentState,
      allSelected,
      "backward"
    );
    let modifier = EditorState.push(editorState, removeRange, "remove-range");
    setEditorState(modifier);
  };

  const handleKeyCommand = (command: string): DraftHandleValue => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    switch (command) {
      case "break-line": {
        const newContentState = Modifier.splitBlock(
          contentState,
          selectionState
        );
        setEditorState(
          EditorState.push(editorState, newContentState, "split-block")
        );

        return "handled";
      }
      case "send-cmt": {
        const plainText = editorState.getCurrentContent().getPlainText();
        if (plainText === "") return "not-handled";
        sendCmt();
        clearContent();
        return "handled";
      }
      default: {
        return "not-handled";
      }
    }
  };

  useEffect(() => {
    if (defaultValue) {
      const parse = JSON.parse(defaultValue);
      setEditorState(EditorState.createWithContent(convertFromRaw(parse)));
    }
  }, [defaultValue]);

  useEffect(() => {
    if (clicked) {
      sendCmt();
      setClicked(false);
    }
  }, [clicked]);

  return (
    <ContentEditableStyled onClick={() => editorRef.current?.focus()}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={myKeyBindingFn}
        placeholder={placeholder}
      />
    </ContentEditableStyled>
  );
};
