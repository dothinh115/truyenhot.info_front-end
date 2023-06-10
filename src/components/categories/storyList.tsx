import { StoriesInCategoryInterface } from "@/models/categories";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { styled, alpha } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
  flexDirection: "row",
  spacing: theme.spacing(1),
  alignItems: "center",
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  minHeight: "100px",
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
  height: "90px",
  objectFit: "cover",
  borderRadius: theme.spacing(1),
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
    color: theme.palette.myText.primary,
  },
}));

const ChapterInfoWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  "&>p:not(:last-of-type)": {
    borderRight: `1px solid ${alpha(theme.palette.mySecondary.boxShadow, 0.5)}`,
    paddingRight: theme.spacing(0.5),
  },
}));

const ChapterInfo = styled(Typography)(({ theme }) => ({
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

const RowStory = ({ storiesData }: Props) => {
  return (
    <>
      <UListStyled>
        {storiesData?.result?.map((story: StoriesInCategoryInterface) => {
          return (
            <ListItemStyled key={story._id}>
              <ListItemInnerWrapper>
                <ListItemInnerImg
                  alt={story.story_title}
                  src={story.story_cover}
                />
              </ListItemInnerWrapper>
              <Stack width={"80%"} gap={"4px"}>
                <ListItemInnerTitle
                  title={story.story_title}
                  href={`/story/${story.story_code}`}
                >
                  {story.story_title}
                </ListItemInnerTitle>
                <ListItemInnerAuthor
                  title={story.story_author}
                  href={`/search/author?keywords=${story.story_author}&exact=true`}
                >
                  <CreateIcon />
                  {story.story_author}
                </ListItemInnerAuthor>
                <ChapterInfoWrapper>
                  <ChapterInfo>
                    <FormatListBulletedIcon />
                    {story._count + " chương"}
                  </ChapterInfo>

                  <ChapterInfo>
                    <FavoriteIcon />
                    {story._like + " lượt thích"}
                  </ChapterInfo>
                </ChapterInfoWrapper>
              </Stack>
            </ListItemStyled>
          );
        })}
      </UListStyled>
    </>
  );
};

export default RowStory;
