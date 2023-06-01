import { MainLayoutContext } from "@/layouts/main";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";
import { memo, useContext } from "react";
import { CommentEditorContext } from "./wrapperEditor";

const Wrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  padding: theme.spacing(0.5),
  width: "100%",
  "& aside.EmojiPickerReact.epr-main": {},
  "& .EmojiPickerReact .epr-preview": {
    display: "none",
  },
  " & .EmojiPickerReact li.epr-emoji-category>.epr-emoji-category-label": {
    position: "static",
  },
}));

const PickerWrapper = styled(Stack)(() => ({
  position: "absolute",
  bottom: "calc(100% + 30px)",
  left: 0,
}));

const EmojiPickerIcon = () => {
  const { mode } = useContext<any>(MainLayoutContext);
  const { setIconPick, showPicker, setShowPicker, wrapperRef, iconButtonRef } =
    useContext<any>(CommentEditorContext);
  const emojiButtonClick = () => {
    setShowPicker(!showPicker);
  };

  const emojiClickHandle = (emojiData: EmojiClickData, event: MouseEvent) => {
    setIconPick(emojiData.emoji);
  };

  return (
    <Wrapper>
      <IconButton
        sx={{
          width: "30px",
          height: "30px",
        }}
        ref={iconButtonRef}
        onClick={emojiButtonClick}
      >
        <InsertEmoticonIcon />
      </IconButton>
      <PickerWrapper
        sx={{
          display: showPicker ? "flex" : "none",
        }}
        ref={wrapperRef}
      >
        <EmojiPicker
          searchDisabled={true}
          skinTonesDisabled={true}
          theme={mode}
          height={"300px"}
          onEmojiClick={emojiClickHandle}
          emojiStyle={EmojiStyle.TWITTER}
        />
      </PickerWrapper>
    </Wrapper>
  );
};

const MemorizedEmojiPickerIcon = memo(EmojiPickerIcon);

export default MemorizedEmojiPickerIcon;
