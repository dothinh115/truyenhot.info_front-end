import { UserSuggesionInterface } from "@/models/users";
import { API } from "@/utils/config";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import { alpha, styled } from "@mui/material/styles";
import {
  createContext,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MemoriezedCommentEditor from "./commentEditor";
import MemorizedEmojiPickerIcon from "./iconPicker";

export const CommentEditorContext = createContext({});

const Wrapper = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  backgroundColor: theme.palette.myBackground.paper,
  border: `1px solid ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  borderRadius: theme.spacing(0.5),
  overflow: "hidden",
  flexGrow: 1,
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  flexWrap: "wrap",
}));

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
  showEmojiButton?: boolean;
};

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

const CommentEditorWrapper = (props: Props) => {
  const { showEmojiButton = false } = props;
  const [userSuggestion, setUserSuggestion] = useState<
    UserSuggesionInterface[]
  >([]);
  const [iconPick, setIconPick] = useState<string | null>(null);
  const suggestionULRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [listIndex, setListIndex] = useState<number>(0);
  const timeout = useRef<NodeJS.Timeout | number | undefined>();
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [mentionClickData, setMentionClickData] = useState<{
    user_id: string;
    _id: string;
  }>();

  const getUserSuggestion = useCallback((user_id: string) => {
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
  }, []);

  const mentionClickHandle = useCallback((user_id: string, _id: string) => {
    setMentionClickData({
      user_id,
      _id,
    });
  }, []);

  const moveDown = () => {
    if (listIndex + 1 > userSuggestion?.length - 1) {
      setListIndex(0);
      return;
    }
    setListIndex(listIndex + 1);
  };

  const moveUp = () => {
    if (listIndex - 1 < 0) {
      setListIndex(userSuggestion.length - 1);
      return;
    }
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

  const outSidePickerClickHandle = (event: any) => {
    if (wrapperRef.current && iconButtonRef.current) {
      if (
        !wrapperRef.current.contains(event.target) &&
        !iconButtonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", arrowPressHandle);
    return () => {
      window.removeEventListener("keydown", arrowPressHandle);
    };
  });

  useEffect(() => {
    window.addEventListener("click", outSidePickerClickHandle);
    return () => {
      window.removeEventListener("click", outSidePickerClickHandle);
    };
  }, []);

  return (
    <Wrapper>
      <CommentEditorContext.Provider
        value={{
          setUserSuggestion,
          setListIndex,
          listIndex,
          mentionClickData,
          userSuggestion,
          getUserSuggestion,
          suggestionULRef,
          setIconPick,
          iconPick,
          showPicker,
          setShowPicker,
          wrapperRef,
          iconButtonRef,
        }}
      >
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
        {showEmojiButton && window.innerWidth > 768 ? (
          <MemorizedEmojiPickerIcon />
        ) : null}
        <MemoriezedCommentEditor {...props} />
      </CommentEditorContext.Provider>
    </Wrapper>
  );
};

const MemorizedCommentEditorWrapper = memo(CommentEditorWrapper);

export default MemorizedCommentEditorWrapper;
