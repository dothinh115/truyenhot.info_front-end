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
  const searchBodyElement = useRef<HTMLDivElement>(null);
  const [searchData, setSearchData] = useState<SearchDataInterface | null>(
    null
  );

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout.current);
    const value = e.currentTarget.value;

    if (value === "") {
      reset({ keywords: "" });
      setSearchData(null);
    }

    timeout.current = setTimeout(async () => {
      if (value !== "") {
        setLoading(true);
        try {
          const searchResponse: any = await API.get(
            `/search/storyTitle?keywords=${value}`
          );
          setSearchData(searchResponse);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    }, 500);
  };

  useEffect(() => {
    if (searchOpen && searchBodyElement?.current)
      searchBodyElement?.current.scroll({ top: 0 });
  }, [searchOpen]);

  const loadingRender = () => {
    let html = [];
    for (let i = 0; i < 4; i++) {
      html.push(
        <Box
          key={i}
          width={"100%"}
          height={"50px"}
          borderRadius={"16px"}
          mb={2}
          sx={{
            animationDuration: "2s",
            animationFillMode: "forwards",
            animationIterationCount: "infinite",
            animationName: "story-list-loading",
            animationTimingFunction: "linear",
            background: "#f6f7f8",
            backgroundImage:
              "linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)",
            backgroundSize: "200%",
          }}
          maxHeight={"100vh"}
          overflow={"hidden"}
        ></Box>
      );
    }
    return html;
  };

  return (
    <>
      <Box
        position={"fixed"}
        bgcolor={"#fff"}
        zIndex={100}
        width={"100%"}
        height={"100%"}
        p={1}
        top={searchOpen ? "0" : "100%"}
        left={0}
        sx={{ transition: "top .2s" }}
        pb={13}
        ref={searchBodyElement}
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
            borderRadius: "5px",
            backgroundColor: "rgba(255,255,255,.15)",
          }}
          maxHeight={"100vh"}
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
                  color: "#000",
                },
                visibility: getValues("keywords") ? "visible" : "hidden",
              }}
              onClick={() => {
                reset({ keywords: "" });
                setSearchData(null);
              }}
            >
              <ClearIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Box className={"hr"} my={2} />
        <Stack maxHeight={"100%"} overflow={"auto"}>
          {loading ? (
            loadingRender()
          ) : searchData?.result.length === 0 && getValues("keywords") ? (
            <Stack direction={"row"} gap={2} justifyContent={"center"}>
              <SearchIcon />
              Không tìm thấy kết quả nào!
            </Stack>
          ) : (
            searchData?.result.map((item: StoriesSearchResultInterface) => {
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
                        color={"rgba(0, 0, 0, .8)"}
                      >
                        {item.story_title}
                      </Typography>
                      <Typography
                        component={"span"}
                        fontSize={".9em"}
                        color={"rgba(0, 0, 0, .6)"}
                      >
                        {item._count} chương
                      </Typography>
                    </Stack>
                  </Stack>
                  <IconButton
                    sx={{
                      "& svg": {
                        color: "#000",
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
            })
          )}

          {searchData?.pagination?.pages &&
          searchData?.pagination?.pages > 1 &&
          !loading ? (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              sx={{
                textDecoration: "none",
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
