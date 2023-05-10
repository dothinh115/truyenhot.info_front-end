import { CategoryInterface } from "@/models/categories";
import { StoriesSearchResultInterface } from "@/models/search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import useSWR from "swr";

type Props = {
  category: CategoryInterface;
};

export const HotStoriesInCate = ({ category }: Props) => {
  const { data: hotStoriesData, isValidating: hotStoriesIsValidating } = useSWR(
    `/stories/getHotStories?category=${category?.cate_code}`
  );

  const isValidatingRender = () => {
    const html = [];
    for (let i = 0; i < 24; i++) {
      html.push(
        <Box
          component={ListItem}
          p={0}
          m={0}
          key={i}
          sx={{
            "&:not(:last-of-type)": {
              borderBottom: "1px dashed #ccc",
            },
            animationDuration: {
              md: "1s",
              xs: "2s",
            },
            height: "28px",
            animationFillMode: "forwards",
            animationIterationCount: "infinite",
            animationName: "story-list-loading",
            animationTimingFunction: "linear",
            background: "#f6f7f8",
            backgroundImage:
              "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
            backgroundSize: "200%",
            position: "relative",
            "&>div": {
              background: "#fff",
              position: "absolute",
            },
          }}
        >
          <Box sx={{ top: 0, left: 0, right: 0, height: "6px" }}></Box>
          <Box sx={{ bottom: 0, left: 0, right: 0, height: "6px" }}></Box>
          <Box sx={{ top: 0, left: 0, bottom: 0, width: "3px" }}></Box>
          <Box sx={{ top: 0, right: 0, bottom: 0, width: "5%" }}></Box>
          <Box
            sx={{
              height: "calc(100% - 6px - 6px)",
              top: "6px",
              left: "calc(3px + 15px )",
              width: "8px",
            }}
          ></Box>
        </Box>
      );
    }
    return html;
  };

  return (
    <>
      <Box>
        <Box
          component={"h3"}
          p={1}
          my={0}
          borderBottom={"1px dashed #ccc"}
          textTransform={"uppercase"}
        >
          Truyện {category?.cate_title} Hot
        </Box>
        <Box>
          <Box component={List} py={0} dense={true}>
            {hotStoriesIsValidating
              ? isValidatingRender()
              : hotStoriesData?.result.map(
                  (story: StoriesSearchResultInterface, index: number) => {
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
                          href={`/story/${story.story_code}`}
                          sx={{
                            px: 0,
                          }}
                        >
                          <Box component={ListItemIcon} minWidth={"25px"}>
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
                            display={{
                              md: "block",
                              xs: "none",
                            }}
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

                          <Box
                            component={ListItemText}
                            display={{
                              md: "none",
                              xs: "block",
                            }}
                            primary={
                              story.story_title.length > 50
                                ? story.story_title.substring(0, 47) + "..."
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
                      </Box>
                    );
                  }
                )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
