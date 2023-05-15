import { StoriesInCategoryInterface } from "@/models/categories";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/material/styles";
type Props = {
  storiesData: {
    result: StoriesInCategoryInterface[];
  };
};

const UListStyled = styled("ul")(({}) => ({
  margin: "0",
  padding: "0",
}));

const ListItemStyled = styled("li")(({ theme }) => ({
  display: "flex",
  gap: "10px",
  backgroundColor: theme.palette.myBackground.secondary,
  padding: theme.spacing(1),
  borderWidth: "1px",
  borderStyle: "dashed",
  borderColor: theme.palette.mySecondary.main,
  flexDirection: "row",
  spacing: theme.spacing(1),
  alignItems: "center",
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  [theme.breakpoints.up("xs")]: {
    maxHeight: "100px",
  },
}));

const ListItemInnerWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.up("xs")]: {
    width: "30%",
  },
  [theme.breakpoints.up("md")]: {
    width: "20%",
  },
}));

const ListItemInnerImg = styled("img")(({ theme }) => ({
  width: "100%",
  maxHeight: "90px",
  objectFit: "cover",
  borderRadius: theme.spacing(2),
}));

const ListItemInnerTitle = styled(Link)(({ theme }) => ({
  fontSize: "18px",
  color: theme.palette.myText.link,
  textDecoration: "none",
  fontWeight: "bold",
  [theme.breakpoints.up("xs")]: {
    fontSize: "1em",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.3em",
  },
}));

const ListItemInnerAuthor = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  color: theme.palette.myText.link,
  textDecoration: "none",
  [theme.breakpoints.up("xs")]: {
    fontSize: ".9em",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1em",
  },
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: "20px",
  },
}));

const ChapterNumber = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  color: theme.palette.myText.primary,
  [theme.breakpoints.up("xs")]: {
    fontSize: ".9em",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1em",
  },
  "& svg": {
    marginRight: theme.spacing(1),
    fontSize: "20px",
  },
}));

export const RowStory = ({ storiesData }: Props) => {
  return (
    <>
      <UListStyled>
        {storiesData?.result?.map((story: StoriesInCategoryInterface) => {
          return (
            <ListItemStyled key={story._id}>
              <ListItemInnerWrapper>
                <ListItemInnerImg src={story.story_cover} />
              </ListItemInnerWrapper>
              <Box width={"80%"}>
                <ListItemInnerTitle href={`/story/${story.story_code}`}>
                  {story.story_title}
                </ListItemInnerTitle>
                <ListItemInnerAuthor
                  href={`/search/author?keywords=${story.story_author}`}
                >
                  <CreateIcon />
                  {story.story_author}
                </ListItemInnerAuthor>
                <ChapterNumber>
                  <FormatListBulletedIcon />
                  {story._count + " chương"}
                </ChapterNumber>
              </Box>
            </ListItemStyled>
          );
        })}
      </UListStyled>
    </>
  );
};
