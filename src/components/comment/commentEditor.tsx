import { UserSuggesionInterface } from "@/models/users";
import { API } from "@/utils/config";
import { Box, alpha, Stack, Chip, IconButton } from "@mui/material";
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
import SendIcon from "@mui/icons-material/Send";

import React, { useEffect, useRef, useState } from "react";
type Props = {
  cb: (data: string) => void;
  clicked: boolean;
  setClicked: (state: boolean) => any;
  placeholder?: string;
  defaultValue?: string;
  replyTo?: string;
  sendIcon?: boolean;
};

const ContentEditableStyled = styled(Stack)(({ theme }) => ({
  position: "relative",
  flexGrow: 1,
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
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
    maxHeight: "calc(21px * 5)",
    overflow: "auto",
    width: "100%",
  },
}));

export const MentionSpanStyled = styled("span")(({ theme }) => ({
  color: "#64b5f6",
  direction: "ltr",
  fontWeight: "400",
}));

const UserSuggestionWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  maxWidth: "100%",
  width: "100%",
  overflow: "auto",
}));

const MENTION_REGEX = /\B@\w+/g;

const getEntityStrategy = (mutability: string) => {
  return function (contentBlock: any, callback: any, contentState: any) {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getMutability() === mutability;
    }, callback);
  };
};

const MentionSpan = (props: any) => {
  return (
    <MentionSpanStyled data-offset-key={props.offsetkey}>
      {props.children}
    </MentionSpanStyled>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("IMMUTABLE"),
    component: MentionSpan,
  },
]);

const CommentEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
  replyTo,
  sendIcon = false,
}: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator)
  );
  const editorRef = useRef<any>();
  const suggestionRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<any>();
  const currentRangeSuggestion = useRef<{
    start: number;
    end: number;
    value: string;
    key: string;
  }>();
  const [userSuggestion, setUserSuggestion] = useState<
    UserSuggesionInterface[]
  >([]);

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

  const getUserSuggestion = (user_id: string) => {
    if (user_id === "") return;
    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      try {
        const response: any = await API.get(
          `/users/getMentionSuggestion/${user_id}`
        );
        setUserSuggestion(response.result);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  };

  const clearSuggestion = () => {
    clearTimeout(timeout.current);
    setUserSuggestion([]);
  };

  const sendCmt = async () => {
    if (editorState.getCurrentContent().getPlainText() === "") return;
    const value = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    cb(value);
    clearContent();
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
    clearSuggestion();
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
        return "handled";
      }
      default: {
        return "not-handled";
      }
    }
  };

  const handleReplyTo = () => {
    let contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const selectionState = editorState.getSelection();
    contentState.createEntity("MENTION", "IMMUTABLE", {
      url: `/user/${replyTo?.replace("@", "")}`,
    });
    const entityKey = contentState.getLastCreatedEntityKey();

    const insertUserID = Modifier.insertText(
      contentState,
      selectionState,
      replyTo ? replyTo : "",
      undefined,
      entityKey
    );

    let newContentState = EditorState.push(
      editorState,
      insertUserID,
      "insert-characters"
    );

    const addBlankSelection = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: replyTo ? replyTo.length : 1,
      focusKey: firstBlock.getKey(),
      focusOffset: replyTo ? replyTo.length + 1 : 1,
    });

    const addBlank = Modifier.replaceText(
      newContentState.getCurrentContent(),
      addBlankSelection,
      String.fromCharCode(160)
    );

    newContentState = EditorState.push(
      newContentState,
      addBlank,
      "change-block-data"
    );

    //di chuyển con trỏ đến ký tự cuối cùng
    newContentState = EditorState.moveFocusToEnd(newContentState);

    setEditorState(newContentState);
  };

  const handleMention = async () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (
      contentState.getPlainText() === "" ||
      contentState.getPlainText() === "@"
    ) {
      //nếu text rỗng thì dừng
      clearSuggestion();
      return;
    }

    const keyOfBlockStanding = selectionState.getAnchorKey(); //key của block đang đứng
    const block = contentState.getBlockForKey(keyOfBlockStanding); //block đang đứng
    const text = block.getText(); //text của block đang đứng
    const anchorOffset = selectionState.getAnchorOffset() - 1; //vị trí ban đầu của con trỏ chuột
    let rangeArr: { start: number; end: number; value: string }[] = []; //lấy range của mention nếu có
    let matchArr;
    while ((matchArr = MENTION_REGEX.exec(text)) !== null) {
      //check xem bên trong text có mention hay ko
      const start = matchArr.index;
      const end = start + matchArr[0].length;
      const value = matchArr[0];
      rangeArr = [
        ...rangeArr,
        {
          start,
          end,
          value,
        },
      ];
    }
    if (rangeArr.length === 0) return clearSuggestion();
    //xét xem con trỏ chuột có đang nằm trong range mention hay ko
    for (let range of rangeArr) {
      const $_match = range.start <= anchorOffset && anchorOffset < range.end;
      if (!$_match) {
        clearSuggestion();
        continue; //nếu ko nằm trong range của mention thì bỏ qua
      } else {
        //vượt qua tất cả thì đã có value của mention, tiến hành call api lấy suggestion
        const user_id = range.value;
        await getUserSuggestion(user_id.replace("@", ""));
        currentRangeSuggestion.current = { ...range, key: keyOfBlockStanding }; //lưu thông tin range hiện tại để dùng sau
        const entityInstace = block.getEntityAt(range.start);
        if (entityInstace) clearSuggestion();
      }
    }
  };

  const mentionClickHandle = (user_id: string) => {
    const contentState = editorState.getCurrentContent();
    const editTextSelection = new SelectionState({
      anchorKey: currentRangeSuggestion.current?.key,
      anchorOffset: currentRangeSuggestion.current?.start,
      focusKey: currentRangeSuggestion.current?.key,
      focusOffset: currentRangeSuggestion?.current?.end,
    });

    //Tạo entity có data, chứa url đến trang profile của user
    contentState.createEntity("MENTION", "IMMUTABLE", {
      url: `/user/${user_id}`,
    });
    const entityKey = contentState.getLastCreatedEntityKey();
    //Tạo text để replace, @do -> @dothinh
    let editText = Modifier.replaceText(
      contentState,
      editTextSelection,
      user_id,
      undefined,
      entityKey
    );
    //push vào editorState
    let newContentState: any = EditorState.push(
      editorState,
      editText,
      "change-block-data"
    );
    //Tiếp tục thêm 1 khoảng trắng đằng sau @dothinh
    //tạo selection mới
    const addBlankSelection = new SelectionState({
      anchorKey: currentRangeSuggestion.current?.key,
      anchorOffset: currentRangeSuggestion.current?.start
        ? currentRangeSuggestion.current?.start + user_id.length
        : user_id.length,
      focusKey: currentRangeSuggestion.current?.key,
      focusOffset: currentRangeSuggestion.current?.start
        ? currentRangeSuggestion.current?.start + user_id.length
        : user_id.length,
      hasFocus: true,
    });

    //Tạo insert text
    const newBlankSpace = Modifier.insertText(
      newContentState.getCurrentContent(),
      addBlankSelection,
      ""
    );

    //tiếp tục push vào editorState, lúc này editorState phải là cái mới đã dc replaceText, tức là newEditorState
    newContentState = EditorState.push(
      newContentState,
      newBlankSpace,
      "insert-characters"
    );

    //setState thay đổi mọi thứ vào editorState hiện tại
    setEditorState(newContentState);
    //clear suggestion sau khi mọi thứ đã xong
    clearSuggestion();
  };

  useEffect(() => {
    handleMention();
  }, [editorState.getCurrentContent()]);

  useEffect(() => {
    if (replyTo) handleReplyTo();
  }, [replyTo]);

  useEffect(() => {
    if (defaultValue) {
      const parse = JSON.parse(defaultValue);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parse), decorator)
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
    <>
      <UserSuggestionWrapper
        ref={suggestionRef}
        sx={{ display: userSuggestion.length !== 0 ? "block" : "none" }}
      >
        {userSuggestion?.map((user: UserSuggesionInterface) => {
          return (
            <Chip
              sx={{
                my: "2px",
                marginRight: "4px",
                fontSize: ".85em",
              }}
              key={user._id}
              label={user.user_id}
              onClick={() => mentionClickHandle(user.user_id)}
            />
          );
        })}
      </UserSuggestionWrapper>
      <ContentEditableStyled onClick={() => editorRef.current?.focus()}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
          placeholder={placeholder}
        />
        <IconButton
          type="submit"
          size="large"
          sx={{
            height: "40px",
            width: "40px",
            display: sendIcon ? "flex" : "none",
          }}
          onClick={() => setClicked(true)}
        >
          <SendIcon />
        </IconButton>
      </ContentEditableStyled>
    </>
  );
};

export default CommentEditor;
