import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { memo, useState } from "react";
import redraft from "redraft";
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
  mainValue: string;
};

// const getMentionEntityStrategy = (mutability: string) => {
//   return function (
//     contentBlock: ContentBlock,
//     callback: any,
//     contentState: ContentState
//   ) {
//     contentBlock.findEntityRanges((character: any) => {
//       const entityKey = character.getEntity();
//       if (entityKey === null) {
//         return false;
//       }
//       return contentState.getEntity(entityKey).getType() === mutability;
//     }, callback);
//   };
// };

// const MentionSpan = (props: any) => {
//   const { url } = props.contentState.getEntity(props.entityKey).getData();
//   return (
//     <MentionLinkStyled data-offset-key={props.offsetkey}>
//       {props.children}
//     </MentionLinkStyled>
//   );
// };

// const mentionDecorator = new CompositeDecorator([
//   {
//     strategy: getMentionEntityStrategy("MENTION"),
//     component: MentionSpan,
//   },
// ]);

const renderers = {
  inline: {},
  blocks: {},
  entities: {
    MENTION: (children: string, data: any, { key }: { key: number }) => (
      <MentionLinkStyled key={key}>{children}</MentionLinkStyled>
    ),
  },
};

const StoryCommentContent = ({ truncatedValue, mainValue }: Props) => {
  const [show, setShow] = useState<boolean>(true);
  const [value, setValue] = useState(
    redraft(JSON.parse(truncatedValue ? truncatedValue : mainValue), renderers)
  );

  const seeMoreHandle = () => {
    setValue(redraft(JSON.parse(mainValue), renderers));
    setShow(false);
  };
  return (
    <ContentWrapper>
      {value}
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
