import { StoriesSearchResultInterface } from "@/models/search";
import { API } from "@/utils/config";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Stack } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    width: "100%",
  },
}));

const StyledResultList = styled(List)(() => ({
  position: "absolute",
  top: "calc(100% + 7px)",
  backgroundColor: "#fff",
  width: "100%",
  maxHeight: "200px",
  overflow: "auto",
  display: "none",
  zIndex: 100,
  border: "1px solid #ccc",
  p: 0,
}));

type Props = {};

export const SearchBar = (props: Props) => {
  const [resultMess, setResultMess] = useState<string>("Loading...");
  const { control, handleSubmit, reset, getValues } = useForm<{
    keywords: string;
  }>({
    mode: "onChange",
    defaultValues: {
      keywords: "",
    },
  });
  const [searchData, setSearchData] = useState<StoriesSearchResultInterface[]>(
    []
  );
  const resultList = useRef<HTMLUListElement>(null);
  const router = useRouter();
  const timeout = useRef<any>(null);
  const inputElement = useRef<HTMLInputElement>(null);

  const submitHandle = (data: any) => {
    router.push(`/search/title?keywords=${data.keywords}`);
    reset({
      keywords: "",
    });
    if (resultList.current) resultList.current.style.display = "none";
    setSearchData([]);
  };

  const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget as HTMLInputElement;
    if (value === "") {
      setSearchData([]);

      if (resultList.current) resultList.current.style.display = "none";
    } else {
      if (searchData && resultList.current)
        resultList.current.style.display = "block";
      setResultMess("Loading...");
    }

    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      if (value) {
        const result: any = await API.get(
          `/search/storyTitleQuickSearch?keywords=${value.trim()}`
        );
        setSearchData(result.result);
        if (result.result.length === 0) {
          const result: any = await API.get(
            `/search/storyAuthor?keywords=${value.trim()}`
          );
          setSearchData(result.result);
        }
        if (searchData.length === 0) setResultMess("Không có kết quả nào!");
      }
    }, 500);
  };

  const dropDownList = (event: any) => {
    if (
      event.target?.parentNode?.parentNode?.parentNode === resultList.current
    ) {
      if (resultList.current) resultList.current.style.display = "none";
    } else if (event.target?.parentNode?.parentNode === inputElement.current) {
      if (searchData && resultList.current)
        resultList.current.style.display = "block";
    } else {
      if (resultList.current) resultList.current.style.display = "none";
    }
  };

  useEffect(() => {
    document.addEventListener("click", dropDownList);

    return () => {
      document.removeEventListener("click", dropDownList);
    };
  }, []);

  return (
    <>
      <Stack
        component={"form"}
        onSubmit={handleSubmit(submitHandle)}
        position={"relative"}
        direction={"row"}
        sx={{
          display: {
            md: "flex",
            xs: "none",
          },
          width: "200px",
          borderRadius: "5px",
          backgroundColor: "rgba(255,255,255,.15)",
        }}
      >
        <IconButton
          sx={{
            "& svg": {
              color: "white",
            },
          }}
        >
          <SearchIcon />
        </IconButton>
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
              ref={inputElement}
              autoComplete={"off"}
              sx={{
                maxHeight: "40px",
                color: "myText.main",
                flexGrow: {
                  md: 0,
                  xs: 1,
                },
              }}
            />
          )}
        />

        <StyledResultList ref={resultList}>
          {searchData?.length === 0 && (
            <ListItem
              sx={{
                borderBottom: "1px dashed #ccc",
                p: 1,
                m: 0,
                color: "#000",
              }}
              dense={true}
            >
              <ListItemText primary={resultMess} />
            </ListItem>
          )}
          {searchData?.map((story: StoriesSearchResultInterface) => {
            return (
              <ListItem
                sx={{
                  borderBottom: "1px dashed #ccc",
                  p: 0,
                  m: 0,
                  color: "#000",
                }}
                dense={true}
                key={story.story_code}
              >
                <ListItemButton
                  component={Link}
                  href={`/story/${story.story_code}`}
                  scroll={true}
                  onClick={() =>
                    reset({
                      keywords: "",
                    })
                  }
                >
                  <ListItemText primary={story.story_title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </StyledResultList>
        <IconButton
          sx={{
            "& svg": {
              color: "white",
            },
            visibility: getValues("keywords") ? "visible" : "hidden",
          }}
          onClick={() => reset({ keywords: "" })}
        >
          <ClearIcon />
        </IconButton>
      </Stack>
    </>
  );
};
