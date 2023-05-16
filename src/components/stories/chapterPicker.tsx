import { ChapterDataInterface, ChapterListInterface } from "@/models/chapters";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/router";

type Props = {
  chapterData: ChapterDataInterface;
  chapterListData: ChapterListInterface[];
};

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
    },
  },
};

export const StoryChapterPicker = ({ chapterData, chapterListData }: Props) => {
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent, child?: any) => {
    router.push({
      pathname: router.pathname,
      query: {
        chapter_code: child.props.value,
        story_code: chapterData?.story_code,
      },
    });
  };
  if (!chapterData) return null;
  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      spacing={1}
      my={2}
      alignItems={"center"}
    >
      <IconButton
        LinkComponent={Link}
        href={`/story/${chapterData?.story_code}/${chapterData?.prevChapter}`}
        disabled={!chapterData?.prevChapter ? true : false}
        color="primary"
        size="large"
      >
        <ArrowBackIcon fontSize="inherit" />
      </IconButton>
      {
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>Chọn chương</InputLabel>
          <Select
            value={
              chapterData?.chapter_code && chapterListData
                ? chapterData?.chapter_code
                : ""
            }
            onChange={(event, child) => handleChange(event, child)}
            input={<OutlinedInput label="Chọn chương" />}
            MenuProps={MenuProps}
            size="small"
          >
            {chapterListData?.map((chapter: any) => (
              <MenuItem key={chapter._id} value={chapter.chapter_code}>
                {chapter.chapter_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }

      <IconButton
        size="large"
        LinkComponent={Link}
        href={`/story/${chapterData?.story_code}/${chapterData?.nextChapter}`}
        disabled={!chapterData?.nextChapter ? true : false}
        color="primary"
      >
        <ArrowForwardIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};
