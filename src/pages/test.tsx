import { Container, Stack, Button, styled } from "@mui/material";
import {
  CompositeDecorator,
  Editor,
  EditorState,
  Modifier,
  SelectionState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import React, { useState, useEffect } from "react";
const MentionSpanStyled = styled("span")(() => ({
  color: "#64b5f6",
  direction: "ltr",
  fontWeight: "400",
}));
type Props = {};

const MENTION_REGEX = /\B@\w+/g;

const getMentionEntityStrategy = (mutability: string) => {
  return function (contentBlock: any, callback: any, contentState: any) {
    contentBlock.findEntityRanges((character: any) => {
      const entityKey = character.getEntity(); //vẫn chưa xác định immutable hay ko
      if (entityKey === null) {
        return false;
      }
      return contentState.getEntity(entityKey).getType() === mutability; //===true
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
    strategy: getMentionEntityStrategy("MENTION"),
    component: MentionSpan,
  },
]);

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
      depth: 0,
      inlineStyleRanges: [],
    },
  ],
});

const test = (props: Props) => {
  const [editorState, setEditorState] = useState(() =>
    //Type: EditorState
    EditorState.createWithContent(emptyContentState)
  );

  const [secondEditorState, setSecondEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState)
  );

  const sendHandle = () => {
    const contentState = editorState.getCurrentContent(); //ContentState
    const selectionState = editorState.getSelection(); //SelectionState
    const currentBlockKey = selectionState.getAnchorKey(); //key
    const currentBlock = contentState.getBlockForKey(currentBlockKey);
    const rangeToReplace = new SelectionState({
      anchorKey: currentBlockKey,
      anchorOffset: currentBlock.getLength() - 1, //7
      focusKey: currentBlockKey,
      focusOffset: currentBlock.getLength(), //8
    });
    const newContentState = Modifier.replaceText(
      contentState,
      rangeToReplace,
      ""
    );
    //lưu
    const raw = convertToRaw(newContentState);

    //flow
    // 1/ lấy contentState
    // 2/ lấy selectionState
    // 3/ Modifier trong contentState
    // 4/ push Modifier vào newEditorState
    // 5/ set lại newEditorState vào trong editorState sẵn có

    //set dữ liệu vào state
    const convertRaw = convertFromRaw(raw);
    const secondEditorState = EditorState.createWithContent(convertRaw);
    setSecondEditorState(secondEditorState);
  };

  const mentionHandle = () => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blocks = contentState.getBlocksAsArray();
    let entitiesData = [];
    for (let block of blocks) {
      const text = block.getText();
      let matchArr;
      while ((matchArr = MENTION_REGEX.exec(text)) !== null) {
        const value = matchArr[0];
        const start = matchArr.index;
      }
    }
  };

  useEffect(() => {
    mentionHandle();
  }, [editorState.getCurrentContent()]);

  return (
    <>
      <Stack direction={"row"} justifyContent={"center"}>
        <Container maxWidth="md">
          <Stack
            direction={"row"}
            sx={{
              backgroundColor: "#fff",
              "& > .DraftEditor-root": {
                width: "100%",
              },
            }}
          >
            <Editor editorState={editorState} onChange={setEditorState} />
            <Button onClick={sendHandle} size="small">
              send
            </Button>
          </Stack>
          <br />
          <Editor
            editorState={secondEditorState}
            onChange={setSecondEditorState}
            readOnly={true}
          />
        </Container>
      </Stack>
    </>
  );
};

export default test;
