import { MainLayoutContext } from "@/layouts";
import {
  SearchDataInterface,
  StoriesSearchResultInterface,
} from "@/models/search";
import { API } from "@/utils/config";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(2),
    width: "100%",
  },
}));

const LoadingAnimation = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "50px",
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  animationDuration: "2s",
  animationFillMode: "forwards",
  animationIterationCount: "infinite",
  animationName: "story-list-loading",
  animationTimingFunction: "linear",
  background: "#f6f7f8",
  backgroundImage: `linear-gradient(to right, ${theme.palette.myBackground.loadingBack} 8%, ${theme.palette.myBackground.loadingMove} 18%, ${theme.palette.myBackground.loadingBack} 33%)`,
  backgroundSize: "200%",
}));

export const SearchModal = (props: Props) => {
  const { control, reset, getValues } = useForm<{
    keywords: string;
  }>({
    mode: "onChange",
    defaultValues: {
      keywords: "",
    },
  });

  const { setSearchOpen, searchOpen } = useContext<any>(MainLayoutContext);
  const [loading, setLoading] = useState<boolean>(false);
  const timeout = useRef<any>(null);
  const inputEl = useRef<HTMLDivElement>(null);
  const searchBodyElement = useRef<HTMLDivElement>(null);
  const [searchData, setSearchData] = useState<SearchDataInterface | null>(
    null
  );
  const [resultMess, setResultmess] = useState<string>(
    "Nhập tên truyện hoặc tên tác giả"
  );

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout.current);
    const value = e.currentTarget.value;
    if (value === "") reset({ keywords: "" });
    timeout.current = setTimeout(async () => {
      if (value !== "") {
        setLoading(true);
        try {
          const searchResponse: any = await API.get(
            `/search/storyTitle?keywords=${value}`
          );
          setSearchData(searchResponse);
          setResultmess("");
          if (searchResponse?.result.length === 0) {
            const authorSearchResponse: any = await API.get(
              `/search/storyAuthor?keywords=${value}`
            );
            setSearchData(authorSearchResponse);
            setResultmess(`Tìm theo tác giả`);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    }, 500);
  };

  const loadingRender = () => {
    let html = [];
    for (let i = 0; i < 12; i++) {
      html.push(<LoadingAnimation key={i}></LoadingAnimation>);
    }
    return html;
  };

  const scrollHandle = () => {
    console.log(searchBodyElement?.current!.scrollTop);
    if (searchBodyElement?.current!.scrollTop > 74) {
      if (inputEl?.current) {
        inputEl!.current.style.position = "fixed";
        inputEl!.current.style.top = "0";
        inputEl!.current.style.left = "0";
        inputEl!.current.style.width = "100%";
        inputEl!.current.style.zIndex = "50";
        inputEl!.current.style.padding = "12px 8px";
      }
    } else {
      if (inputEl?.current) {
        inputEl!.current.style.position = "static";
        inputEl!.current.style.padding = "8px 0";
      }
    }
  };

  useEffect(() => {
    if (searchOpen && searchBodyElement?.current) {
      searchBodyElement?.current.scroll({ top: 0 });
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchData?.result.length === 0)
      setResultmess("Không tìm thấy kết quả nào");
  }, [searchData]);

  useEffect(() => {
    if (getValues("keywords") === "") {
      reset({ keywords: "" });
      setSearchData(null);
      setResultmess("Nhập tên truyện hoặc tên tác giả");
    }
  }, [getValues("keywords")]);

  useEffect(() => {
    if (searchBodyElement?.current)
      searchBodyElement?.current!.addEventListener("scroll", scrollHandle);

    return () => {
      if (searchBodyElement?.current)
        searchBodyElement?.current!.removeEventListener("scroll", scrollHandle);
    };
  }, []);

  return (
    <>
      <Box
        position={"fixed"}
        bgcolor={"myBackground.default"}
        zIndex={100}
        width={"100%"}
        height={"100%"}
        p={1}
        top={searchOpen ? "0" : "100%"}
        left={0}
        sx={{ transition: "top .2s" }}
        ref={searchBodyElement}
        overflow={"auto"}
      >
        <Stack
          direction={"row"}
          ref={inputEl}
          py={1}
          sx={{
            backgroundColor: "myBackground.default",
          }}
        >
          <Stack
            component={"form"}
            position={"relative"}
            direction={"row"}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            sx={{
              width: {
                md: "25%",
                xs: "100%",
              },
              backgroundColor: "myBackground.default",
            }}
          >
            <IconButton onClick={() => setSearchOpen(false)}>
              <ArrowBackIosIcon />
            </IconButton>
            <Stack
              direction={"row"}
              border={"1px solid #ccc"}
              width={"100%"}
              borderRadius={"16px"}
            >
              <Controller
                name={"keywords"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <StyledInputBase
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(e);
                      onChangeHandle(e);
                    }}
                    value={value}
                    placeholder="Tìm kiếm"
                    size="small"
                    autoComplete={"off"}
                    sx={{
                      maxHeight: "40px",
                      color: "myText.primary",
                      flexGrow: {
                        md: 0,
                        xs: 1,
                      },
                    }}
                  />
                )}
              />
              <IconButton
                sx={{
                  "& svg": {
                    color: "myText.primary",
                  },
                  visibility: getValues("keywords") ? "visible" : "hidden",
                }}
                onClick={() => {
                  reset({ keywords: "" });
                }}
              >
                <ClearIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>

        {resultMess && (
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            my={2}
            sx={{
              color: "myText.primary",
            }}
          >
            <SearchIcon />
            {resultMess}
          </Stack>
        )}

        <Stack>
          {loading
            ? loadingRender()
            : searchData?.result.map((item: StoriesSearchResultInterface) => {
                return (
                  <Stack
                    key={item._id}
                    component={Link}
                    href={`/story/${item.story_code}`}
                    sx={{ textDecoration: "none" }}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    mb={2}
                    onClick={() => {
                      setSearchOpen(false);
                    }}
                  >
                    <Stack direction={"row"} alignItems={"center"}>
                      <Box
                        component={"img"}
                        alt={item.story_title}
                        src={item.story_cover}
                        width={"35px"}
                        height={"35px"}
                        mr={1}
                        borderRadius={"5px"}
                        sx={{ objectFit: "cover" }}
                      />
                      <Stack p={0} m={0}>
                        <Typography
                          component={"span"}
                          fontSize={"1.1em"}
                          color={"myText.link"}
                        >
                          {item.story_title}
                        </Typography>
                        <Typography
                          component={"span"}
                          fontSize={".9em"}
                          color={"myText.primary"}
                        >
                          {item._count} chương
                        </Typography>
                      </Stack>
                    </Stack>
                    <IconButton
                      sx={{
                        "& svg": {
                          color: "myText.primary",
                        },
                      }}
                      onClick={() => {
                        reset({ keywords: "" });
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Stack>
                );
              })}

          {searchData?.pagination?.pages &&
          searchData?.pagination?.pages > 1 &&
          !loading ? (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              sx={{
                textDecoration: "none",
                color: "myText.link",
              }}
              component={Link}
              href={`/search/title?keywords=${getValues("keywords")}`}
              onClick={() => {
                setSearchOpen(false);
              }}
            >
              Xem thêm kết quả
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </>
  );
};
