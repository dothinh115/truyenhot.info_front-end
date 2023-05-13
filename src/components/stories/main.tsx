import { CategoryInterface } from "@/models/categories";
import { ChapterDataInterface } from "@/models/chapters";
import { StoryInterface } from "@/models/stories";
import { timeSince } from "@/utils/function";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Pagination, {
  PaginationRenderItemParams,
} from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { RowLoading } from "../loading";
import { StoryReportButton } from "./reportButton";
const Wrapper = styled("h2")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0",
  color: "rgba(0, 0, 0, .65)",
}));

const TitleWrapper = styled("h1")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  textAlign: "center",
  marginBottom: "8px",
  fontWeight: "500",
  letterSpacing: "-1px",
  wordSpacing: "2px",
}));

const Title = styled(Box)(() => ({
  display: "inline",
  padding: "4px 8px",
  color: "#606fc3",
  borderRadius: "5px",
  border: "1px dashed #7986cb47",
}));

const TitleAndImgWrapper = styled(Box)(() => ({
  position: "relative",
  height: "270px",
}));

const ImgWrapper = styled(Box)(() => ({
  position: "relative",
  height: "270px",
  width: "180px",
  left: "50%",
  transform: "translateX(-50%)",
  borderRadius: "10px",
  overflow: "hidden",
}));

const CoverImage = styled("img")(() => ({
  objectFit: "cover",
  position: "absolute",
  width: "100%",
  height: "100%",
  top: "0",
  left: "0",
}));

const ViewStyled = styled(Stack)(() => ({
  flexDirection: "row",
  alignItems: "center",
  position: "absolute",
  justifyContent: "center",
  gap: "4px",
  maxHeight: "24px",
  left: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, .8)",
  width: "100%",
  color: "#fff",
  fontSize: ".95em",
  padding: "3px",
  "& svg": {
    width: ".7em",
    height: ".7em",
  },
}));

const ButtonWrapper = styled(Stack)(() => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginTop: "8px",
}));

const UListStyled = styled("ul")(() => ({
  margin: 0,
  listStyleType: "none",
  paddingLeft: "0",
  "& a ": {
    textDecoration: "none",
    color: "#303f9f",
  },
  "& > li > a, & > li > h4, & > li > p": {
    display: "inline-block",
    marginRight: "5px",
  },
  "& p, & a, & h4, & li": {
    fontSize: "13px",
  },
  "& > li > h4": {
    marginTop: "0",
    marginBottom: "0",
  },
  "& > li": {
    lineHeight: "30px",
    "&:not(:last-child)": {
      borderBottom: "1px dashed #7986cba6",
    },
    display: "flex",
    alignItems: "flex-start",
    "& h4": {
      alignItems: "center",
      color: "rgba(0, 0, 0, .85)",
      display: "inline-flex",
      "& svg": {
        color: "rgba(0, 0, 0, .45)",
        height: "20px",
        width: "20px",
        marginRight: "8px",
        marginTop: "2px",
      },
      "& span": {
        display: "inline-block",
        width: "60px",
      },
    },
  },
  "& > li > ul": {
    display: "inline-block",
    paddingLeft: "8px",
  },
}));

const ChapterListWrapper = styled(Box)(() => ({
  border: "1px dashed #7986cba6",
  borderRadius: "16px",
  backgroundColor: "#fff",
  margin: "16px 0",
  overflow: "hidden",
}));

const ChapterListH3 = styled("h3")(() => ({
  margin: "0",
  padding: "5px",
  paddingLeft: "16px",
  color: "#7986cb",
  borderBottom: "1px dashed #7986cba6",
}));

const ListStyled = styled(List)(({ theme }) => ({
  height: "100%",
  overflow: "auto",
  backgroundColor: "#fff",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    borderRadius: "0 16px 16px 0",
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
  "&>li": {
    borderBottom: "1px dashed #7986cba6",
    padding: "8px 0",
    height: "35px",
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
  [theme.breakpoints.up("xs")]: {
    maxHeight: "100%",
  },
  [theme.breakpoints.up("md")]: {
    maxHeight: "600px",
  },
}));

type Props = {
  story: StoryInterface;
};

export const StoryMain = ({ story }: Props) => {
  const router = useRouter();
  const { story_code, page } = router?.query;
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const {
    data: chapterListData,
    mutate: chapterListMutate,
    isValidating: chapterListIsValidating,
  } = useSWR(
    `/chapter/getChapterListByStoryCode/${story_code}?page=${page ? page : 1}`,
    { revalidateOnMount: false, keepPreviousData: true }
  );
  const [showMore, setShowMore] = useState<boolean>(false);

  const paginationRowLoading = () => {
    let result = [];
    for (let i = 0; i < 15; i++) {
      result.push(<RowLoading key={i} />);
    }
    return result;
  };

  useEffect(() => {
    if (page) setPaginationPage(+page);
    if (story) chapterListMutate();
  }, [story, page]);

  useEffect(() => {
    if (story?.story_description)
      story.story_description = story.story_description
        .replaceAll("<div text-align: justify; >", "")
        .replaceAll("</div>", "");
  }, [story?.story_description]);

  return (
    <>
      <Wrapper>THÔNG TIN TRUYỆN</Wrapper>
      <Box className={"hr"} />

      <TitleWrapper>
        <Title>{story?.story_title}</Title>
      </TitleWrapper>
      <TitleAndImgWrapper>
        <ImgWrapper>
          <CoverImage src={story?.story_cover} alt={story?.story_title} />
          <ViewStyled>
            <RemoveRedEyeIcon />
            <Box component={"span"}>{story?.story_view}</Box>
          </ViewStyled>
        </ImgWrapper>
      </TitleAndImgWrapper>
      <ButtonWrapper>
        <Button
          variant="outlined"
          color="info"
          size="small"
          startIcon={<PlayCircleFilledIcon />}
          onClick={() =>
            router.push({
              pathname: `/story/[story_code]/[chapter_code]`,
              query: {
                story_code: story?.story_code,
                chapter_code: story?.start_chapter,
              },
            })
          }
        >
          Đọc truyện
        </Button>
        <StoryReportButton
          open={reportModalOpen}
          setOpen={setReportModalOpen}
          story_code={story?.story_code}
        />
      </ButtonWrapper>
      <Stack direction={"row"} justifyContent={"center"}>
        <FavoriteIcon
          sx={{
            color: "red",
            height: "25px",
            lineHeight: "25px",
            fontSize: "25px",
          }}
        />
        <Typography
          sx={{
            fontStyle: "italic",
            fontSize: "13px",
            height: "25px",
            lineHeight: "25px",
          }}
        >
          3000 lượt like
        </Typography>
      </Stack>
      <Stack
        sx={{
          border: "1px dashed #7986cba6",
          margin: "16px 0",
          padding: "8px",
          borderRadius: "16px",
          backgroundColor: "#fff",
        }}
      >
        <UListStyled>
          <Box component={"li"}>
            <Box component={"h4"}>
              <PersonIcon />
              Tác giả:
            </Box>
            <Box
              component={Link}
              href={`/search/author?keywords=${story?.story_author}`}
            >
              {story?.story_author}
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>
              <FolderIcon />
              <Box component={"span"}>Thể loại:</Box>
            </Box>
            <Box component={"span"}>
              {story?.story_category.map((cate: CategoryInterface) => {
                return (
                  <Chip
                    component={Link}
                    href={`/categories/${cate.cate_code}`}
                    label={cate.cate_title}
                    size="small"
                    key={cate.cate_id}
                    sx={{
                      mr: "4px",
                      cursor: "pointer",
                      "&>span": { color: "#fff" },
                    }}
                    color="primary"
                  />
                );
              })}
            </Box>
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>
              <ArrowForwardIosIcon />
              Nguồn:
            </Box>
            {story?.story_source}
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>
              <StarIcon />
              Trạng thái:
            </Box>
            {story?.story_status}
          </Box>
          <Box component={"li"}>
            <Box component={"h4"}>
              <UpdateIcon />
              Update lần cuối:
            </Box>
            {story?.updated_at && (
              <>{`${timeSince(
                Math.abs(
                  new Date().valueOf() - new Date(story?.updated_at).valueOf()
                )
              )} trước`}</>
            )}
          </Box>
        </UListStyled>
      </Stack>
      <Stack
        sx={{
          border: "1px dashed #7986cba6",
          margin: "16px 0",
          padding: "8px",
          borderRadius: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          component={"h3"}
          sx={{
            margin: "0",
            color: "#7986cb",
            borderBottom: "1px dashed #7986cba6",
          }}
        >
          Mô tả truyện
        </Box>
        {story?.story_description && (
          <Box
            component={"div"}
            sx={{
              fontSize: "13px",
            }}
            dangerouslySetInnerHTML={{
              __html:
                story?.story_description.length >= 400
                  ? showMore
                    ? story?.story_description
                    : story?.story_description.substring(0, 400) + "..."
                  : story?.story_description,
            }}
          ></Box>
        )}
        <Stack direction={"row"} justifyContent={"center"}>
          <IconButton onClick={() => setShowMore(!showMore)} size="small">
            {showMore ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </Stack>
      </Stack>

      <Stack
        display={{
          xs: "flex",
          md: "none",
        }}
        direction={"row"}
        justifyContent={"center"}
        mt={2}
      >
        <Pagination
          count={chapterListData?.pagination.pages}
          page={paginationPage}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              href={`/story/${story_code}?page=${item.page}#chapter-list`}
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>

      <ChapterListWrapper id="chapter-list">
        <ChapterListH3>Danh sách chương</ChapterListH3>
        <ListStyled dense={true}>
          {chapterListIsValidating
            ? paginationRowLoading()
            : chapterListData?.result.map((data: ChapterDataInterface) => {
                return (
                  <ListItem key={data._id} dense={true}>
                    <Box component={ListItemIcon} minWidth={"25px"}>
                      <ArrowCircleRightIcon />
                    </Box>
                    <ListItemButton
                      component={Link}
                      href={`/story/${story_code}/${data.chapter_code}`}
                      sx={{
                        px: 1,
                        "&:hover": {
                          backgroundColor: "unset",
                        },
                      }}
                    >
                      <ListItemText
                        sx={{
                          "& > span": {
                            fontSize: {
                              md: "1em",
                              xs: ".9em",
                            },
                          },
                        }}
                        primary={`${data.chapter_name}${
                          data.chapter_title ? ": " + data.chapter_title : ""
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
        </ListStyled>
      </ChapterListWrapper>
      <Stack direction={"row"} justifyContent={"center"} mt={2}>
        <Pagination
          count={chapterListData?.pagination.pages}
          page={paginationPage}
          color="primary"
          sx={{
            "& button": {
              m: "unset",
            },
          }}
          renderItem={(item: PaginationRenderItemParams) => (
            <PaginationItem
              component={Link}
              href={`/story/${story_code}?page=${item.page}#chapter-list`}
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </>
  );
};
