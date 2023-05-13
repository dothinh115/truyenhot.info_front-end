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
    <Stack direction={"row"} justifyContent={"center"} spacing={1} my={2}>
      <Button
        component={Link}
        href={`/story/${chapterData?.story_code}/${chapterData?.prevChapter}`}
        color="info"
        variant="contained"
        size="small"
        disabled={!chapterData?.prevChapter ? true : false}
      >
        <ArrowBackIcon />
        <Typography
          display={{
            md: "block",
            xs: "none",
          }}
        >
          Chương trước
        </Typography>
      </Button>
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
          >
            {chapterListData?.map((chapter: any) => (
              <MenuItem key={chapter._id} value={chapter.chapter_code}>
                {chapter.chapter_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }

      <Button
        component={Link}
        href={`/story/${chapterData?.story_code}/${chapterData?.nextChapter}`}
        color="info"
        variant="contained"
        size="small"
        disabled={!chapterData?.nextChapter ? true : false}
      >
        <Typography
          display={{
            md: "block",
            xs: "none",
          }}
        >
          Chương sau
        </Typography>
        <ArrowForwardIcon />
      </Button>
    </Stack>
  );
};
