import { StoriesInCategoryInterface } from "@/models/categories";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";

type Props = {
  storiesData: {
    result: StoriesInCategoryInterface[];
  };
};

export const RowStory = ({ storiesData }: Props) => {
  return (
    <>
      <Box component={"ul"} m={0} p={0}>
        {storiesData?.result?.map((story: StoriesInCategoryInterface) => {
          return (
            <Stack
              component={"li"}
              bgcolor={"#fff"}
              p={1}
              sx={{
                border: "1px dashed #7986cba6",
              }}
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              mb={1}
              key={story.story_code}
              maxHeight={{
                xs: "100px",
              }}
              borderRadius={"15px"}
              overflow={"hidden"}
            >
              <Stack
                width={{
                  md: "20%",
                  xs: "30%",
                }}
                direction={"row"}
                alignItems={"center"}
              >
                <Box
                  component={"img"}
                  src={story.story_cover}
                  width={"100%"}
                  maxHeight={"90px"}
                  sx={{
                    objectFit: "cover",
                  }}
                  borderRadius={"15px"}
                />
              </Stack>
              <Box width={"80%"}>
                <Box
                  component={Link}
                  href={`/story/${story.story_code}`}
                  fontSize={18}
                  color={"#283593"}
                  sx={{
                    textDecoration: "none",
                    fontSize: {
                      md: "1.3em",
                      xs: "1em",
                    },
                  }}
                  fontWeight={"bold"}
                >
                  {story.story_title}
                </Box>
                <Typography
                  component={Link}
                  href={`/search/author?keywords=${story.story_author}`}
                  display={"flex"}
                  alignItems={"center"}
                  fontSize={14}
                  color={"#616161"}
                  sx={{
                    textDecoration: "none",
                    fontSize: {
                      md: "1em",
                      xs: ".9em",
                    },
                    "& svg": {
                      mr: 1,
                      fontSize: "20px",
                    },
                  }}
                >
                  <CreateIcon />
                  {story.story_author}
                </Typography>
                <Typography
                  display={"flex"}
                  alignItems={"center"}
                  fontSize={14}
                  color={"#616161"}
                  sx={{
                    fontSize: {
                      md: "1em",
                      xs: ".9em",
                    },
                    "& svg": {
                      mr: 1,
                      fontSize: "20px",
                    },
                  }}
                >
                  <FormatListBulletedIcon />
                  {story._count.chapter + " chương"}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Box>
    </>
  );
};
