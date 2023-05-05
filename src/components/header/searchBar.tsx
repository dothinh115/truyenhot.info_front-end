import { StoriesSearchResultInterface } from "@/models/search";
import { API } from "@/utils/config";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
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

type Props = {
  position: string;
};

export const SearchBar = ({ position }: Props) => {
  const [resultMess, setResultMess] = useState<string>("Loading...");
  const { control, handleSubmit, reset } = useForm<{ keywords: string }>({
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

  const submitHandle = (data: any) => {
    router.push(`/search/title?keywords=${data.keywords}`);
    reset({
      keywords: "",
    });
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
          `/search/storyTitle?keywords=${value}`
        );
        setSearchData(result.result);
        if (result.result.length === 0) {
          const result: any = await API.get(
            `/search/storyAuthor?keywords=${value}`
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
  const inputElement = useRef(null);

  useEffect(() => {
    document.addEventListener("click", dropDownList);
    return () => {
      document.removeEventListener("click", dropDownList);
    };
  }, []);
  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Box
          component={"form"}
          onSubmit={handleSubmit(submitHandle)}
          position={"relative"}
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
                ref={inputElement}
                autoComplete={"off"}
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
                    href={`/${
                      (position === "header" && "story") ||
                      (position === "adminPage" && "admin/stories")
                    }/${story.story_code}`}
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
        </Box>
      </Search>
    </>
  );
};
