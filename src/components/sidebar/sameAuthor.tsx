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
type Props = { sameAuthor: StoriesSearchResultInterface[] };

export const SameAuthorSidebar = ({ sameAuthor }: Props) => {
  if (sameAuthor?.length !== 0)
    return (
      <>
        <Box mb={1}>
          <Box component={"h3"} p={1} my={0} borderBottom={"1px dashed #ccc"}>
            Truyện cùng tác giả
          </Box>
          <Box>
            <Box component={List} py={0} dense={true}>
              {sameAuthor?.map(
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
                    </Box>
                  );
                }
              )}
            </Box>
          </Box>
        </Box>
      </>
    );
  else return null;
};
