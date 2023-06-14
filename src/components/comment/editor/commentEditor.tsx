import { useAuth } from "@/hooks/auth/useAuth";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
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
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { CommentEditorContext } from "./wrapperEditor";

type Props = {
  cb: (data: {
    truncatedValue: string;
    mainValue: string;
    mentionData: string[];
  }) => void;
  clicked: boolean;
  setClicked: (state: boolean) => any;
  placeholder?: string;
  defaultValue?: string;
  replyTo?: {
    user_id: string;
    _id: string;
  };
};

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
    position: "relative",
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

const MENTION_REGEX = /\B@\w+/g;

const getMentionEntityStrategy = (mutability: string) => {
  return function (contentBlock: any, callback: any, contentState: any) {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getType() === mutability;
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

const mentionDecorator = new CompositeDecorator([
  {
    strategy: getMentionEntityStrategy("MENTION"),
    component: MentionSpan,
  },
]);

const contentMaxLength = 400;
const maxRow = 5;

const CommentEditor = ({
  cb,
  clicked,
  setClicked,
  placeholder,
  defaultValue,
  replyTo,
}: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(mentionDecorator)
  );
  const editorRef = useRef<any>();
  const timeout = useRef<NodeJS.Timeout | number | undefined>();
  const characterCount = useRef<number>(0);
  const { profile } = useAuth();
  const {
    setUserSuggestion,
    setListIndex,
    listIndex,
    mentionClickData,
    userSuggestion,
    getUserSuggestion,
    suggestionULRef,
    iconPick,
    setIconPick,
    setShowPicker,
  } = useContext<any>(CommentEditorContext);

  const currentRangeSuggestion = useRef<{
    start: number;
    end: number;
    value: string;
    key: string;
  }>();

  const iconPickChange = (emoji: string) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const addEmoji = Modifier.insertText(contentState, selectionState, emoji);
    const newEditorState = EditorState.push(
      editorState,
      addEmoji,
      "insert-characters"
    );
    setEditorState(newEditorState);
  };

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

  const clearSuggestion = () => {
    clearTimeout(timeout.current);
    if (userSuggestion.length !== 0) setUserSuggestion([]);
    if (listIndex !== 0) setListIndex(0);
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
  ): string[] => {
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
          const _id = contentState
            .getEntity(block.getEntityAt(start))
            .getData()._id;

          entities.push(_id);
        }
      );
    }
    return [...new Set(entities)];
  };

  const shouldContentTruncatedFunc = (
    comment_content: ContentState
  ): EditorState | undefined => {
    const editorState = EditorState.createWithContent(
      comment_content,
      mentionDecorator
    );
    const contentState = editorState.getCurrentContent();
    const blockArr = contentState.getBlocksAsArray(); // lấy toàn bộ block trong content
    //Xử lý trường hợp nhiều block, xuống hàng liên tục
    if (blockArr.length > maxRow) {
      //tiến hành tạo contentState mới với 5 block đầu tiên
      let newBlockArr: ContentBlock[] = [];
      let i = 0;
      while (i < maxRow) {
        newBlockArr = [...newBlockArr, blockArr[i]];
        i++;
      }
      //tạo newContentState
      let newContentState: ContentState | EditorState =
        ContentState.createFromBlockArray(newBlockArr);
      //tiếp tục thêm ... vào sau cùng
      //lấy block cuối cùng
      const lastBlock = newContentState.getLastBlock();
      //tạo selection vị trí cuối cùng của block thứ 5
      const lastPosSelection = new SelectionState({
        anchorKey: lastBlock.getKey(),
        anchorOffset: lastBlock.getLength(),
        focusKey: lastBlock.getKey(),
        focusOffset: lastBlock.getLength(),
      });
      const addEllipsis = Modifier.insertText(
        newContentState,
        lastPosSelection,
        "..."
      );
      const newEditorState = EditorState.push(
        editorState,
        addEllipsis,
        "insert-characters"
      );
      return newEditorState;
    }

    let maxLength: number = contentMaxLength; //400
    let currentLength: number = 0; //lấy độ dài hiện tại, đến khi vượt quá maxLength thì ngừng
    let truncatedBlockArr: ContentBlock[] = [];
    for (let block of blockArr) {
      currentLength += block.getText().length; // chạy vòng lặp lấy length từng block thêm vào currentLength
      truncatedBlockArr = [...truncatedBlockArr, block]; //nếu currentLength chưa lớn hơn maxLength thì block này vẫn dc tính
      if (currentLength >= maxLength) break; //nếu đã lớn hơn maxLength thì dừng
    }
    if (currentLength <= maxLength) {
      return; //trường hợp cmt ngắn thì dừng ngay
    }

    //block cuối chính là block phá vỡ maxLength, nên cần replace text ở block này
    let selectionStart: number = 0; //lấy vị trí start, tức là length của những block trước block cuối cùng
    //chạy vòng lặp lấy length của các block trước block cuối
    for (let i = 0; i < truncatedBlockArr.length - 1; i++) {
      selectionStart += truncatedBlockArr[i].getLength();
    }
    //tạo contentState mới từ chuỗi block đã tạo ở trên, với decorator
    const newContentState = ContentState.createFromBlockArray(
      truncatedBlockArr,
      mentionDecorator
    );
    const truncatedLastBlock = newContentState.getLastBlock(); //lấy block cuối
    //tạo range cần replace text ở block cuối
    selectionStart = maxLength - selectionStart;
    //kiểm tra xem có entity ở ký tự cuối cùng hay ko
    let entityCheck = truncatedLastBlock.getEntityAt(selectionStart);
    while (entityCheck !== null) {
      //nếu có thì tăng giới hạn lên 10 và kiểm tra lại
      selectionStart += 10;
      entityCheck = truncatedLastBlock.getEntityAt(selectionStart);
    }
    const replaceTextSelection = new SelectionState({
      anchorKey: truncatedLastBlock.getKey(),
      anchorOffset: selectionStart, //lấy maxLength trừ đi ký tự của các block trước sẽ lấy dc start range của block cuối
      focusKey: truncatedLastBlock.getKey(),
      focusOffset: truncatedLastBlock.getLength(),
    });
    //tạo contentState mới, replace vào
    const replaceText = Modifier.replaceText(
      newContentState,
      replaceTextSelection,
      "..."
    );
    let newEditorState = EditorState.push(
      editorState,
      replaceText,
      "change-block-data"
    );
    return newEditorState;
  };

  const sendCmt = async () => {
    if (blankBlockRemoveHandle().getPlainText() === "") {
      clearContent();
      return;
    }
    const mentionData = getAllMentionData(blankBlockRemoveHandle(), "MENTION");
    const value = blankBlockRemoveHandle(); //Chưa truncated

    const shouldContentTruncated = shouldContentTruncatedFunc(value);

    const mainValue = {
      truncatedValue:
        shouldContentTruncated !== undefined
          ? JSON.stringify(
              convertToRaw(shouldContentTruncated.getCurrentContent())
            )
          : "",
      mainValue: JSON.stringify(convertToRaw(value)),
      mentionData,
    };

    cb(mainValue);
    clearContent();
    setShowPicker(false);
  };

  const clearContent = () => {
    const contentState = editorState.getCurrentContent();
    if (contentState.getPlainText() === "") return;
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
    const newEditorState = EditorState.push(
      editorState,
      removeRange,
      "remove-range"
    );
    setEditorState(newEditorState);
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
    if (replyTo?.user_id === profile?.result.user_id) return;
    let contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const lastBlock = contentState.getLastBlock();
    const allSelected = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getLength(),
      hasFocus: true,
    });
    contentState.createEntity("MENTION", "IMMUTABLE", {
      _id: replyTo?._id,
      url: `/user/${replyTo?.user_id.replace("@", "")}`,
    });
    const entityKey = contentState.getLastCreatedEntityKey();

    const insertUserID = Modifier.replaceText(
      contentState,
      allSelected,
      replyTo?.user_id ? replyTo.user_id : "",
      undefined,
      entityKey
    );

    let newEditorState = EditorState.push(
      editorState,
      insertUserID,
      "insert-characters"
    );

    const addBlankSelection = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: replyTo ? replyTo.user_id.length : 1,
      focusKey: firstBlock.getKey(),
      focusOffset: replyTo ? replyTo.user_id.length : 1,
    });

    const addBlank = Modifier.insertText(
      newEditorState.getCurrentContent(),
      addBlankSelection,
      String.fromCharCode(160)
    );

    newEditorState = EditorState.push(
      newEditorState,
      addBlank,
      "insert-characters"
    );

    //di chuyển con trỏ đến ký tự cuối cùng
    newEditorState = EditorState.moveFocusToEnd(newEditorState);

    setEditorState(newEditorState);
  };

  const handleMention = async () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    if (
      contentState.getPlainText() === "" ||
      contentState.getPlainText() === "@" ||
      contentState.getPlainText().length < characterCount.current
    ) {
      //nếu text rỗng thì dừng
      clearSuggestion();
      characterCount.current = 0;
      return;
    }

    const keyOfBlockStanding = selectionState.getAnchorKey(); //key của block đang đứng
    const block = contentState.getBlockForKey(keyOfBlockStanding); //block đang đứng
    const text = block.getText(); //text của block đang đứng
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
      const $_match = selectionState.hasEdgeWithin(
        keyOfBlockStanding,
        range.start,
        range.end
      );
      if (!$_match) {
        clearSuggestion();
        continue;
      } else {
        const entityInstace = block.getEntityAt(
          selectionState.getFocusOffset() - 1
        );
        if (entityInstace) {
          clearSuggestion();
          return;
        }
        //vượt qua tất cả thì đã có value của mention, tiến hành call api lấy suggestion
        const user_id = range.value;
        await getUserSuggestion(user_id.replace("@", ""));
        characterCount.current = contentState.getPlainText().length;
        currentRangeSuggestion.current = { ...range, key: keyOfBlockStanding }; //lưu thông tin range hiện tại để dùng sau
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
      _id,
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
    let newEditorState: any = EditorState.push(
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
      newEditorState.getCurrentContent(),
      addBlankSpaceSelection,
      String.fromCharCode(160)
    );

    newEditorState = EditorState.push(
      newEditorState,
      addBlank,
      "insert-characters"
    );

    //setState thay đổi mọi thứ vào editorState hiện tại
    setEditorState(newEditorState);
    //clear suggestion sau khi mọi thứ đã xong
    clearSuggestion();
  };

  useEffect(() => {
    if (mentionClickData)
      mentionClickHandle(mentionClickData.user_id, mentionClickData._id);
  }, [mentionClickData]);

  useEffect(() => {
    handleMention();
  }, [editorState.getCurrentContent()]);

  useEffect(() => {
    if (replyTo) handleReplyTo();
    replyTo = undefined;
  }, [replyTo]);

  useEffect(() => {
    if (defaultValue) {
      const parse = JSON.parse(defaultValue);
      setEditorState(
        EditorState.createWithContent(convertFromRaw(parse), mentionDecorator)
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
    if (iconPick) {
      iconPickChange(iconPick);
      setIconPick(null);
    }
  }, [iconPick]);

  return (
    <>
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
        }}
        onClick={() => setClicked(true)}
      >
        <SendIcon />
      </IconButton>
    </>
  );
};

const MemoriezedCommentEditor = memo(CommentEditor);

export default MemoriezedCommentEditor;
