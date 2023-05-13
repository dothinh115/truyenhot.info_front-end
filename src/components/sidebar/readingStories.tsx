import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReadingStoriesInterface } from "@/models/stories";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {};

export const ReadingStoriesHistory = (props: Props) => {
  let getData = localStorage.getItem("readingStories");
  let data: ReadingStoriesInterface[] = [];
  if (getData) data = JSON.parse(getData);
  const [readingStories, setReadingStories] =
    useState<ReadingStoriesInterface[]>(data);
  if (readingStories.length === 0) return null;
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
                  <Box
                    component={ListItem}
                    p={0}
                    m={0}
                    key={story.story_code}
                    sx={{
                      "&:not(:last-of-type)": {
                        borderBottom: "1px dashed #ccc",
                      },
                    }}
                  >
                    <ListItemButton
                      component={Link}
                      href={`/story/${story.story_code}/${story.chapter_code}`}
                      sx={{
                        px: 0,
                      }}
                    >
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

                      <Box
                        component={ListItemText}
                        primary={`[${story.chapter_name
                          .replaceAll("Chương ", "C")
                          .replaceAll("Quyển ", "Q")
                          .replaceAll(" - ", "-")
                          .replaceAll("CHƯƠNG ", "C")
                          .replaceAll("QUYỂN ", "Q")}]${story.story_title}`}
                        m={0}
                        sx={{
                          "& > span": {
                            fontSize: 14,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    </ListItemButton>
                  </Box>
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
