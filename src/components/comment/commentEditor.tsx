import { Box, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CompositeDecorator,
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
  replyTo?: string;
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
    "& .public-DraftEditorPlaceholder-inner": {
      position: "absolute",
      color: alpha(theme.palette.myText.primary, 0.5),
    },
  },
}));

export const MentionSpanStyled = styled("span")(({ theme }) => ({
  color: theme.palette.myText.heading,
  direction: "ltr",
  fontWeight: "600",
}));

const MENTION_REGEX = /\B@\w+/g;

const MentionSpan = (props: any) => {
  return (
    <MentionSpanStyled data-offset-key={props.offsetKey}>
      {props.children}
    </MentionSpanStyled>
  );
};
function findWithRegex(regex: RegExp, contentBlock: any, callback: any) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

function mentionStrategy(contentBlock: any, callback: any) {
  findWithRegex(MENTION_REGEX, contentBlock, callback);
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: mentionStrategy,
    component: MentionSpan,
  },
]);

export const CommentEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
  replyTo,
}: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(compositeDecorator)
  );

  const editorRef = useRef<any>();

  const myKeyBindingFn = (e: React.KeyboardEvent): string | null => {
    if (e.key === "Enter") {
      if (e.altKey || e.shiftKey) {
        return "break-line";
      } else {
        return "send-cmt";
      }
    } else {
    }
    return getDefaultKeyBinding(e);
  };

  const sendCmt = async () => {
    let contentState = editorState.getCurrentContent();
    const blockArr = contentState.getBlocksAsArray();
    let newEditorState = editorState;
    for (let block of blockArr) {
      const key = block.getKey();
      const text = block.getText();
      let start, matchArr, end;
      let i: any[] = [];
      while ((matchArr = MENTION_REGEX.exec(text)) !== null) {
        start = matchArr.index;
        end = start + matchArr[0].length;
        i = [...i, { start, end }];
      }
      // for (let x = 0; x < i.length; x++) {
      if (i.length !== 0) {
        const selection = new SelectionState({
          anchorKey: key,
          anchorOffset: start,
          focusKey: key,
          focusOffset: end,
        });
        let newContentState = contentState.createEntity(
          "MENTION",
          "IMMUTABLE",
          {
            url: "",
          }
        );
        const entityKey = contentState.getLastCreatedEntityKey();
        newContentState = Modifier.applyEntity(
          newContentState,
          selection,
          entityKey
        );
        newEditorState = EditorState.push(
          editorState,
          newContentState,
          "apply-entity"
        );
        contentState = editorState.getCurrentContent();
      }
    }
    // }

    const value = JSON.stringify(
      convertToRaw(newEditorState?.getCurrentContent())
    );
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

  const handleReplyTo = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    let newContentState = Modifier.insertText(
      contentState,
      selectionState,
      replyTo ? replyTo + " " : ""
    );
    setEditorState(
      EditorState.push(editorState, newContentState, "insert-characters")
    );
  };

  useEffect(() => {
    if (replyTo) handleReplyTo();
  }, [replyTo]);

  useEffect(() => {
    if (defaultValue) {
      const parse = JSON.parse(defaultValue);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parse), compositeDecorator)
      );
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
