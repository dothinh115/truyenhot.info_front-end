import { StoriesSearchResultInterface } from "@/models/stories";
import { API } from "@/utils/config";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box, Container, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

type Props = {};

export const HeaderDesktop = (props: Props) => {
  const router = useRouter();
  const timeout = useRef<any>(null);
  const [searchData, setSearchData] = useState<StoriesSearchResultInterface[]>(
    []
  );

  const { control, handleSubmit, setValue } = useForm<{ keywords: string }>({
    mode: "onChange",
    defaultValues: {
      keywords: "",
    },
  });

  const submitHandle = (data: any) => {
    router.push(`/search?keywords=${data.keywords}`);
  };

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget as HTMLInputElement;
    if (value === "") setSearchData([]);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      if (value) {
        const result: any = await API.get(
          `/search/storyTitle?keywords=${value}`
        );
        setSearchData(result.result);
      }
    }, 500);
  };

  useEffect(() => {
    console.log(searchData);
  }, [searchData]);

  return (
    <>
      <Box
        display={{
          md: "block",
          sm: "none",
        }}
        height={"100%"}
        margin={"auto"}
      >
        <Container
          maxWidth={"md"}
          sx={{
            m: "auto!important",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"50px"}
          >
            <Box>
              <Box
                component={Link}
                sx={{
                  color: "#fff",
                  display: "flex",
                  alignItem: "center",
                  textDecoration: "none",
                  gap: "8px",
                  "& > svg": {
                    fontSize: "50px",
                    height: "50px",
                  },
                  "& > p": {
                    height: "50px",
                    display: "flex",
                    alignItems: "center!important",
                  },
                  height: "50px",
                }}
                href="/"
              >
                <MenuBookIcon />
                <Typography>TRUYENHOT.INFO</Typography>
              </Box>
            </Box>
            <Box>
              <Box
                component={"form"}
                onSubmit={handleSubmit(submitHandle)}
                position={"relative"}
              >
                <Controller
                  name={"keywords"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(e);
                        onChangeHandle(e);
                      }}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: "4px",
                        width: "250px",
                      }}
                      value={value}
                      placeholder="Tìm kiếm"
                      size="small"
                      onBlur={() => setSearchData([])}
                    />
                  )}
                />
                {searchData.length > 0 && (
                  <Box
                    component={List}
                    position={"absolute"}
                    top={"calc(100% + 7px)"}
                    bgcolor={"#fff"}
                    width={"100%"}
                    maxHeight={"200px"}
                    overflow={"auto"}
                    sx={{
                      border: "1px solid #ccc",
                      p: 0,
                    }}
                  >
                    {searchData?.map((story: StoriesSearchResultInterface) => {
                      return (
                        <ListItem
                          sx={{
                            borderBottom: "1px dashed #ccc",
                            p: 0,
                            m: 0,
                          }}
                          dense={true}
                          key={story.story_code}
                        >
                          <ListItemButton
                            component={Link}
                            href={`/story/${story.story_code}`}
                            scroll={true}
                          >
                            <ListItemText primary={story.story_title} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};
