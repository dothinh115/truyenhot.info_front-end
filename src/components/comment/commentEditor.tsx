import { UserSuggesionInterface } from "@/models/users";
import { API } from "@/utils/config";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
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
import emojiCompact from "emoji.json/emoji-compact.json";

type Props = {
  cb: (data: string) => void;
  clicked: boolean;
  setClicked: (state: boolean) => any;
  placeholder?: string;
  defaultValue?: string;
  replyTo?: string;
  sendIcon?: boolean;
};

const Wrapper = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  backgroundColor: theme.palette.myBackground.paper,
  border: `1px solid ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  borderRadius: theme.spacing(0.5),
  overflow: "hidden",
  position: "relative",
  flexGrow: 1,
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  flexWrap: "wrap",
}));
const ContentEditableStyled = styled(Stack)(({ theme }) => ({
  width: "calc(100% - 40px)",
  maxHeight: "calc(21px * 10)",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    borderRadius: theme.spacing(0, 2, 2, 0),
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
  "&> .DraftEditor-root": {
    borderRadius: "4px",
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
    width: "100%",
  },
}));

const MentionSpanStyled = styled("span")(() => ({
  color: "#64b5f6",
  direction: "ltr",
  fontWeight: "400",
}));

const UserSuggestionUL = styled(List)(({ theme }) => ({
  width: "100%",
  padding: 0,
  borderBottom: `1px dashed ${theme.palette.mySecondary.boxShadow}`,
}));

const UserSuggestionItem = styled(ListItemButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.myBackground.default,
  },
  "&.active": {
    backgroundColor: theme.palette.myBackground.default,
  },
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
  const suggestionULRef = useRef<HTMLUListElement>(null);
  const timeout = useRef<any>();
  const [listIndex, setListIndex] = useState<number>(0);

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
    if (userSuggestion?.length !== 0) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") return "arrow-pressed";
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
    setListIndex(0);
  };

  const blankBlockRemoveHandle = (): ContentState => {
    const contentState: ContentState = editorState.getCurrentContent();
    let blockArr: ContentBlock[] = contentState.getBlocksAsArray();
    let firstHasContentBlockIndex: number = 0;
    let lastHasContentBlockIndex: number = blockArr.length;
    let any = false;
    for (let block of blockArr) {
      if (block.getText().length !== 0) {
        any = true;
        break;
      }
    }

    if (!any) return EditorState.createEmpty().getCurrentContent();

    for (let index in blockArr) {
      if (blockArr[index].getText().length !== 0) {
        firstHasContentBlockIndex = Number(index);
        break;
      }
    }
    for (let i = blockArr.length - 1; i >= firstHasContentBlockIndex; i--) {
      if (blockArr[i].getText().length !== 0) {
        lastHasContentBlockIndex = i;
        break;
      }
    }
    blockArr = blockArr.slice(
      firstHasContentBlockIndex,
      lastHasContentBlockIndex + 1
    );

    const newContentState = ContentState.createFromBlockArray(blockArr);
    return newContentState;
  };

  const getAllMentionData = (
    contentState: ContentState,
    entityType: string
  ) => {
    let entities: any[] = [];
    const blockArr: ContentBlock[] = contentState.getBlocksAsArray();
    //lấy toàn bộ thông tin entities có trong contentState
    for (let block of blockArr) {
      block.findEntityRanges(
        (charater: CharacterMetadata) => {
          if (charater.getEntity() !== null) {
            const entity = contentState.getEntity(charater.getEntity());
            if (entity.getType() === entityType) {
              return true;
            }
          }
          return false;
        },
        (start: number, end: number) => {
          entities.push(block.getText().slice(start, end));
        }
      );
    }
  };

  const sendCmt = async () => {
    if (blankBlockRemoveHandle().getPlainText() === "") {
      clearContent();
      return;
    }
    const mentionData = getAllMentionData(blankBlockRemoveHandle(), "MENTION");
    const value = JSON.stringify(convertToRaw(blankBlockRemoveHandle()));
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
    const newContentState = EditorState.push(
      editorState,
      removeRange,
      "remove-range"
    );
    setEditorState(newContentState);
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
        if (userSuggestion.length === 0) {
          const plainText = editorState.getCurrentContent().getPlainText();
          if (plainText === "") return "not-handled";
          sendCmt();
          return "handled";
        } else {
          if (suggestionULRef.current) {
            suggestionULRef.current.querySelectorAll("div")[listIndex].click();
          }
        }
      }
      case "arrow-pressed": {
        return "not-handled";
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
      focusOffset: replyTo ? replyTo.length : 1,
    });

    const addBlank = Modifier.insertText(
      newContentState.getCurrentContent(),
      addBlankSelection,
      String.fromCharCode(160)
    );

    newContentState = EditorState.push(
      newContentState,
      addBlank,
      "insert-characters"
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
        break;
      }
    }
  };

  const mentionClickHandle = (user_id: string, _id: string) => {
    const contentState = editorState.getCurrentContent();
    const editTextSelection = new SelectionState({
      anchorKey: currentRangeSuggestion.current?.key,
      anchorOffset: currentRangeSuggestion.current?.start,
      focusKey: currentRangeSuggestion.current?.key,
      focusOffset: currentRangeSuggestion?.current?.end,
    });

    //Tạo entity có data, chứa url đến trang profile của user
    contentState.createEntity("MENTION", "IMMUTABLE", {
      url: `/user/${_id}`,
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

    //tạo selection mới
    const addBlankSpaceSelection = new SelectionState({
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

    const addBlank = Modifier.insertText(
      newContentState.getCurrentContent(),
      addBlankSpaceSelection,
      String.fromCharCode(160)
    );

    newContentState = EditorState.push(
      newContentState,
      addBlank,
      "insert-characters"
    );

    //setState thay đổi mọi thứ vào editorState hiện tại
    setEditorState(newContentState);
    //clear suggestion sau khi mọi thứ đã xong
    clearSuggestion();
  };

  const moveDown = () => {
    if (listIndex + 1 > userSuggestion?.length - 1) return;
    setListIndex(listIndex + 1);
  };
  const moveUp = () => {
    if (listIndex - 1 < 0) return;
    setListIndex(listIndex - 1);
  };
  const arrowPressHandle = (event: any) => {
    if (userSuggestion.length === 0) return;
    switch (event.key) {
      case "ArrowDown": {
        moveDown();
        break;
      }
      case "ArrowUp": {
        moveUp();
        break;
      }
    }
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

  useEffect(() => {
    window.addEventListener("keydown", arrowPressHandle);
    return () => {
      window.removeEventListener("keydown", arrowPressHandle);
    };
  });

  return (
    <>
      <Wrapper>
        <EmojiPicker />
        <UserSuggestionUL
          sx={{ display: userSuggestion.length !== 0 ? "block" : "none" }}
          ref={suggestionULRef}
        >
          {userSuggestion?.map(
            (user: UserSuggesionInterface, index: number) => {
              return (
                <UserSuggestionItem
                  className={index === listIndex ? "active" : ""}
                  key={user._id}
                  onClick={() => mentionClickHandle(user.user_id, user._id)}
                >
                  {user.user_id}
                </UserSuggestionItem>
              );
            }
          )}
        </UserSuggestionUL>
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
      </Wrapper>
    </>
  );
};

const EmojiPicker = () => {
  const emojis = () => {
    let emojis: any[] = [];
    for (let i = 0; i < 500; i++) {
      emojis = [...emojis, emojiCompact[i]];
    }
    return emojis;
  };
  return (
    <>
      <Stack direction={"row"}></Stack>
    </>
  );
};

export default CommentEditor;
