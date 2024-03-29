import { StoriesSearchResultInterface } from "@/models/search";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { styled } from "@mui/material/styles";

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  padding: "0",
  margin: "0",
  "&:not(:last-of-type)": {
    borderBottomWidth: "1px",
    borderBottomStyle: "dashed",
    borderBottomColor: theme.palette.mySecondary.borderBottom,
  },
}));

const H3Styled = styled("h2")(({ theme }) => ({
  padding: theme.spacing(1),
  margin: "0",
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.borderBottom,
  color: theme.palette.myText.primary,
  textTransform: "uppercase",
}));

const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  margin: "0",
  "& > span": {
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.palette.myText.primary,
  },
}));

type Props = {
  sameAuthor: StoriesSearchResultInterface[];
};

const SameAuthorSidebar = ({ sameAuthor }: Props) => {
  if (sameAuthor?.length === 0) return null;
  return (
    <>
      <Box>
        <H3Styled>Truyện cùng tác giả</H3Styled>
        <Box>
          <Box component={List} py={0} dense={true}>
            {sameAuthor?.map(
              (story: StoriesSearchResultInterface, index: number) => {
                return (
                  <ListItemStyled key={story._id}>
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
      <Box className={"hr"} my={2} />
    </>
  );
};

export default SameAuthorSidebar;
