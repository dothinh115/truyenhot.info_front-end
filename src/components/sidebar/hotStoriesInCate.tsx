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

type Props = {
  category: CategoryInterface;
  hotStoriesInCategory: StoriesSearchResultInterface[];
};

export const HotStoriesInCate = ({ category, hotStoriesInCategory }: Props) => {
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
            {hotStoriesInCategory?.map(
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
                        primary={story.story_title}
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
    </>
  );
};
