import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
  convertFromRaw,
} from "draft-js";
import { useState, useEffect } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
const MentionLinkStyled = styled("span")(() => ({
  color: "#64b5f6",
  direction: "ltr",
  fontWeight: "400",
  textDecoration: "none",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  "& p": {
    margin: 0,
  },
}));

type Props = {
  comment_content: string;
};

const getMentionEntityStrategy = (mutability: string) => {
  return function (
    contentBlock: ContentBlock,
    callback: any,
    contentState: ContentState
  ) {
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
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <MentionLinkStyled data-offset-key={props.offsetkey}>
      {props.children}
    </MentionLinkStyled>
  );
};

const contentMaxLength = 400;
const maxRow = 5;
const mentionDecorator = new CompositeDecorator([
  {
    strategy: getMentionEntityStrategy("MENTION"),
    component: MentionSpan,
  },
]);

const StoryCommentContent = ({ comment_content }: Props) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(comment_content)),
      mentionDecorator
    )
  );

  const [show, setShow] = useState<boolean>(false);

  const shouldContentTruncated = () => {
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
      newContentState = EditorState.push(
        editorState,
        addEllipsis,
        "insert-characters"
      );
      setEditorState(newContentState);
      setShow(true);
      return;
    }
    let maxLength: number = contentMaxLength; //400
    let currentLength: number = 0; //lấy độ dài hiện tại, đến khi vượt quá maxLength thì ngừng
    let truncatedBlockArr: ContentBlock[] = [];
    for (let block of blockArr) {
      currentLength += block.getText().length; // chạy vòng lặp lấy length từng block thêm vào currentLength
      truncatedBlockArr = [...truncatedBlockArr, block]; //nếu currentLength chưa lớn hơn maxLength thì block này vẫn dc tính
      if (currentLength >= maxLength) break; //nếu đã lớn hơn maxLength thì dừng
    }
    if (currentLength <= maxLength) return; //trường hợp cmt ngắn thì dừng ngay

    //nếu đã đến dc đây thì đây là 1 cmt dài, cần hiện nút xem thêm
    setShow(true);
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
    //cuối cùng set lại editorState
    setEditorState(newEditorState);
  };

  const seeMoreHandle = () => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(comment_content)),
        mentionDecorator
      )
    );
    setShow(false);
  };

  useEffect(() => {
    shouldContentTruncated();
  }, [comment_content]);

  return (
    <ContentWrapper>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        readOnly={true}
      />
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          display: show ? "flex" : "none",
        }}
      >
        <IconButton size="small" onClick={seeMoreHandle}>
          <ArrowDropDownIcon />
        </IconButton>
      </Stack>
    </ContentWrapper>
  );
};

export default StoryCommentContent;
