import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
} from "draft-js";
import { memo, useState } from "react";
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
  truncatedValue: string;
  mainValue: any;
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

const mentionDecorator = new CompositeDecorator([
  {
    strategy: getMentionEntityStrategy("MENTION"),
    component: MentionSpan,
  },
]);

const StoryCommentContent = ({ truncatedValue, mainValue }: Props) => {
  const [show, setShow] = useState<boolean>(true);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(truncatedValue ? truncatedValue : mainValue)),
      mentionDecorator
    )
  );

  const seeMoreHandle = () => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(mainValue)),
        mentionDecorator
      )
    );
    setShow(false);
  };

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
          display: truncatedValue && show ? "flex" : "none",
        }}
      >
        <IconButton size="small" onClick={seeMoreHandle}>
          <ArrowDropDownIcon />
        </IconButton>
      </Stack>
    </ContentWrapper>
  );
};

const MemorizedStoryCommentContent = memo(StoryCommentContent);

export default MemorizedStoryCommentContent;
