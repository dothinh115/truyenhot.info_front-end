import React, { useEffect } from "react";
import useSWR from "swr";
import {
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { StoriesSearchResultInterface } from "@/models/search";
import Link from "next/link";
import { StoryInterface } from "@/models/stories";
type Props = {
  story: StoryInterface;
};

export const SameAuthorSidebar = ({ story }: Props) => {
  const { data: storiesData, mutate: storiesMutate } = useSWR(
    `/search/storyAuthor?keywords=${story?.story_author}`,
    {
      revalidateOnMount: false,
    }
  );

  useEffect(() => {
    if (story?.story_author) storiesMutate();
  }, []);

  const newStoriesData = storiesData?.result.filter(
    (item: StoriesSearchResultInterface) => item.story_code !== story.story_code
  );

  return (
    <>
      {newStoriesData?.length !== 0 && (
        <Box border={"1px solid #ccc"} mb={1}>
          <Box
            component={"h3"}
            p={1}
            my={0}
            bgcolor={"#e8eaf6"}
            borderBottom={"1px dashed #ccc"}
          >
            Truyện cùng tác giả
          </Box>
          <Box>
            <Box component={List} py={0} dense={true}>
              <Box component={ListItem} p={0}>
                {newStoriesData?.map((story: StoriesSearchResultInterface) => {
                  return (
                    <ListItemButton
                      component={Link}
                      key={story.story_code}
                      href={`/story/${story.story_code}`}
                      sx={{
                        p: 1,
                        "&:not(:last-of-type)": {
                          borderBottom: "1px dashed #ccc",
                        },
                      }}
                    >
                      <Box component={ListItemIcon} minWidth={"25px"}>
                        <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
                      </Box>

                      <Box
                        component={ListItemText}
                        primary={
                          story.story_title.length > 30
                            ? story.story_title.substring(0, 29) + "..."
                            : story.story_title
                        }
                        m={0}
                        sx={{
                          "& > span": {
                            fontSize: 14,
                          },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
