import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { StoriesInCategoryInterface } from "@/models/categories";
import Link from "next/link";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

type Props = {
  storiesData: {
    result: StoriesInCategoryInterface[];
  };
};

export const RowStory = ({ storiesData }: Props) => {
  return (
    <>
      <Box component={"ul"} m={0} p={0}>
        {storiesData?.result.map((story: StoriesInCategoryInterface) => {
          return (
            <Stack
              component={"li"}
              bgcolor={"#fff"}
              p={1}
              sx={{
                border: "1px dashed #ccc",
              }}
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              mb={1}
              key={story.story_code}
              maxHeight={{
                xs: "100px",
              }}
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
