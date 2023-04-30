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
  storiesSameAuthor: StoriesSearchResultInterface[];
};

export const SameAuthorSidebar = ({ storiesSameAuthor }: Props) => {
  if (storiesSameAuthor?.length !== 0)
    return (
      <>
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
              {storiesSameAuthor?.map((story: StoriesSearchResultInterface) => {
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
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </>
    );
  else return null;
};
