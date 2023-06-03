import {
  SearchDataInterface,
  StoriesSearchResultInterface,
} from "@/models/search";
import { API } from "@/utils/config";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MainLayoutContext } from "@/layouts/main";

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
  height: "68.89px",
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

const ModalInner = styled(Stack)(({ theme }) => ({
  position: "fixed",
  backgroundColor: theme.palette.myBackground.default,
  zIndex: 100,
  padding: theme.spacing(1),
  overflow: "hidden",
  [theme.breakpoints.up("xs")]: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "unset",
    transform: "unset",
    minWidth: "unset",
  },
  [theme.breakpoints.up("md")]: {
    top: "50%",
    left: "50%",
    width: "40%",
    height: "80%",
    borderRadius: theme.spacing(2),
    transform: "translate(-50%, -50%)",
    minWidth: "600px",
  },
}));

const FormStyled = styled("form")(({ theme }) => ({
  display: "flex",
  position: "relative",
  width: "100%",
  backgroundColor: theme.palette.myBackground.default,
}));

const ResultList = styled(Box)(() => ({
  "&::-webkit-scrollbar": {
    borderRadius: "0 16px 16px 0",
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
  overflow: "auto",
  width: "100%",
}));

const ResultItem = styled(Link)(({ theme }) => ({
  display: "flex",
  textDecoration: "none",
  backgroundColor: theme.palette.myBackground.secondary,
  marginBottom: "8px",
  borderRadius: "16px",
  padding: "4px 8px",
  justifyContent: "space-between",
  alignItems: "center",
}));

const SearchModal = (props: Props) => {
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
  const timeout = useRef<NodeJS.Timeout | number | undefined>();
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
          setResultmess("Tìm theo tên truyện");
          if (searchResponse?.result.length === 0) {
            const authorSearchResponse: any = await API.get(
              `/search/storyAuthor?keywords=${value}&exact=true`
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

  const onCloseHandle = () => setSearchOpen(!searchOpen);

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

  return (
    <>
      <Modal open={searchOpen} onClose={onCloseHandle}>
        <ModalInner>
          <Stack
            direction={"row"}
            py={1}
            sx={{
              backgroundColor: "myBackground.default",
            }}
            width={"100%"}
          >
            <FormStyled
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <IconButton
                sx={{ width: "42px", height: "42px" }}
                onClick={() => setSearchOpen(false)}
                size="small"
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Stack
                direction={"row"}
                border={"1px solid #ccc"}
                flexGrow={1}
                borderRadius={"16px"}
                overflow={"hidden"}
                sx={{
                  backgroundColor: "myBackground.secondary",
                }}
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
                        flexGrow: 1,
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
            </FormStyled>
          </Stack>

          <Box className="hr" my={1} />

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

          <ResultList>
            {loading
              ? loadingRender()
              : searchData?.result.map((item: StoriesSearchResultInterface) => {
                  return (
                    <ResultItem
                      key={item._id}
                      href={`/story/${item.story_code}`}
                      onClick={() => {
                        setSearchOpen(false);
                      }}
                    >
                      <Stack direction={"row"} alignItems={"center"}>
                        <Box
                          component={"img"}
                          alt={item.story_title}
                          src={item.story_cover}
                          width={"55px"}
                          height={"55px"}
                          mr={1}
                          borderRadius={"5px"}
                          sx={{ objectFit: "cover" }}
                        />
                        <Stack
                          p={0}
                          m={0}
                          sx={{
                            "& p": {
                              fontSize: "1.1em",
                              color: "myText.link",
                            },
                            "& span": {
                              fontSize: ".9em",
                              color: "myText.primary",
                            },
                          }}
                        >
                          <Typography>{item.story_title}</Typography>
                          <Typography component={"span"}>
                            {item.story_author}
                          </Typography>
                          <Typography component={"span"}>
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
                    </ResultItem>
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
          </ResultList>
        </ModalInner>
      </Modal>
    </>
  );
};

export default SearchModal;
