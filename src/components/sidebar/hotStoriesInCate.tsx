import { CategoryInterface } from "@/models/categories";
import { HotStoriesInCategoriesInterface } from "@/models/search";
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
import { styled } from "@mui/material/styles";

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  padding: "0",
  margin: "0",
  "&:not(:last-of-type)": {
    borderBottomWidth: "1px",
    borderBottomStyle: "dashed",
    borderBottomColor: theme.palette.mySecondary.main,
  },
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  margin: "0",
  color: theme.palette.myText.link,
  "& > span": {
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

type Props = {
  category: CategoryInterface;
  hotStoriesInCategory: HotStoriesInCategoriesInterface[];
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
          color={"myText.primary"}
        >
          Truyện {category?.cate_title} Hot
        </Box>
        <Box>
          <Box component={List} py={0} dense={true}>
            {hotStoriesInCategory?.map(
              (story: HotStoriesInCategoriesInterface, index: number) => {
                return (
                  <ListItemStyled key={story.story_code}>
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

                      <ListItemTextStyled primary={story.story_title} />
                    </ListItemButton>
                  </ListItemStyled>
                );
              }
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
