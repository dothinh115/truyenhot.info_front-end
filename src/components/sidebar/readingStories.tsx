import { ReadingStoriesInterface } from "@/models/stories";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, List, ListItem, ListItemIcon, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";

const ListItemStyled = styled(ListItem)(() => ({
  padding: "0",
  margin: "0",
  "&:not(:last-of-type)": {
    borderBottom: "1px dashed #ccc",
  },
}));

const RowWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  paddingTop: "0",
  paddingBottom: "0",
  alignItems: "center",
  width: "100%",
  fontSize: "13.5",
  height: "28px",
}));

const MainLink = styled(Link)(() => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textDecoration: "none",
  flexGrow: 1,
  margin: "0",
}));

const ChapterLink = styled(Link)(() => ({
  textAlign: "right",
  width: "60px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

type Props = {};

export const ReadingStoriesHistory = (props: Props) => {
  const [readingStories, setReadingStories] = useState<
    ReadingStoriesInterface[]
  >([]);
  useEffect(() => {
    const getData = localStorage.getItem("readingStories");
    if (getData) setReadingStories(JSON.parse(getData));
  }, []);
  if (readingStories.length === 0 || typeof window === "undefined") return null;
  return (
    <>
      <Box>
        <Box component={"h3"} p={1} my={0} borderBottom={"1px dashed #ccc"}>
          Truyện đang đọc
        </Box>
        <Box>
          <Box component={List} py={0} dense={true}>
            {readingStories?.map(
              (story: ReadingStoriesInterface, index: number) => {
                return (
                  <ListItemStyled key={story.story_code}>
                    <RowWrapper>
                      <Box component={ListItemIcon} minWidth={"15px"}>
                        <ArrowForwardIosIcon
                          sx={{
                            fontSize: "15px",
                            color:
                              (index + 1 === 1 && "error.main") ||
                              (index + 1 === 2 && "success.main") ||
                              (index + 1 === 3 && "info.main") ||
                              "#ccc",
                          }}
                        />
                      </Box>

                      <MainLink
                        href={`/story/${story.story_code}`}
                        title={story.story_title}
                      >
                        {story.story_title}
                      </MainLink>

                      <ChapterLink
                        href={`/story/${story.story_code}/${story.chapter_code}`}
                        title={story?.chapter_name}
                      >
                        {story?.chapter_name
                          .replaceAll("Chương ", "C")
                          .replaceAll("Quyển ", "Q")
                          .replaceAll(" - ", "-")
                          .replaceAll("CHƯƠNG ", "C")
                          .replaceAll("QUYỂN ", "Q")}
                      </ChapterLink>
                    </RowWrapper>
                  </ListItemStyled>
                );
              }
            )}
          </Box>
        </Box>
      </Box>
      <Box className={"hr"} my={2} />
    </>
  );
};
