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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import UpdateIcon from "@mui/icons-material/Update";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import { styled, alpha } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Pagination, {
  PaginationRenderItemParams,
} from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { RowLoading } from "../loading/rowLoading";
const StoryReportButton = dynamic(() => import("./reportButton"));
const StoryCommentButton = dynamic(() => import("../stories/commentButton"));
const StoryLikeButton = dynamic(() => import("./likeButton"));
const Wrapper = styled("h2")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0",
  color: theme.palette.text.primary,
}));

const TitleWrapper = styled("h1")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  textAlign: "center",
  marginBottom: "8px",
  fontWeight: "500",
  letterSpacing: "-1px",
  wordSpacing: "2px",
  margin: "16px 0",
  padding: 0,
  color: theme.palette.myText.heading,
  textShadow: "0px 1px 1px rgba(255, 255, 255, .2)",
  [theme.breakpoints.up("xs")]: {
    fontSize: "25px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "30px",
  },
}));

const ViewedAndImgWrapper = styled(Box)(() => ({
  position: "relative",
  height: "270px",
  display: "flex",
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

const ButtonWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  "&>button": {
    padding: "8px 4px",
    fontSize: ".8em",
    flexGrow: 1,
    width: "calc(100%/3)",
    borderRadius: "0px",
    "& > span": {
      marginRight: "3px",
    },
  },
}));

const UListStyled = styled("ul")(({ theme }) => ({
  margin: 0,
  listStyleType: "none",
  paddingLeft: "0",
  flexGrow: 1,
  fontSize: "13px",
  "& a ": {
    textDecoration: "none",
    color: theme.palette.myText.link,
  },
  "& > li": {
    "&:not(:last-child)": {
      borderBottomWidth: "1px",
      borderBottomStyle: "dashed",
      borderBottomColor: theme.palette.mySecondary.main,
    },
  },
}));

const StoryDetailListStyled = styled("li")(({ theme }) => ({
  padding: "4px",
  color: theme.palette.myText.primary,
  minHeight: "30px",
  display: "flex",
  alignItems: "flex-start",
  lineHeight: "25px",
  gap: "5px",
  "& > ul": {
    display: "inline-block",
    paddingLeft: "8px",
  },
  "&>span>a": {
    marginTop: "2px",
    marginBottom: "2px",
  },
}));

const StoryDetailListLeftBoxStyled = styled(Box)(({ theme }) => ({
  alignItems: "center",
  color: theme.palette.myText.secondary,
  display: "flex",
  "& svg": {
    color: theme.palette.info.main,
    height: "20px",
    width: "20px",
    marginRight: "8px",
  },
  "& span": {
    display: "inline-block",
    width: "60px",
  },
}));

const ChapterListWrapper = styled(Box)(({ theme }) => ({
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.1)}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.myBackground.secondary,
  margin: theme.spacing(2, 0),
  overflow: "hidden",
}));

const ChapterListH3 = styled("h3")(({ theme }) => ({
  margin: "0",
  padding: "5px",
  paddingLeft: theme.spacing(2),
  color: theme.palette.myText.heading,
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
}));

const ListStyled = styled(List)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.myBackground.secondary,
  overflowY: "auto",
  padding: 0,
  "&::-webkit-scrollbar": {
    borderRadius: theme.spacing(0, 2, 2, 0),
    backgroundColor: "transparent",
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#7986cba6",
  },
  "&>li": {
    borderBottomWidth: "1px",
    borderBottomStyle: "dashed",
    borderBottomColor: theme.palette.mySecondary.main,
    padding: theme.spacing(0, 2),
    minHeight: "37px",
    "&:last-of-type": {
      borderBottom: "none",
    },
    color: theme.palette.myText.primary,
  },
  [theme.breakpoints.up("xs")]: {
    maxHeight: "100%",
  },
  [theme.breakpoints.up("md")]: {
    maxHeight: "600px",
  },
}));

const ULWrapper = styled(Stack)(({ theme }) => ({
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.1)}`,
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.myBackground.secondary,
  flexGrow: 1,
  overflow: "hidden",
}));

const DescriptionWrapper = styled(Stack)(({ theme }) => ({
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.1)}`,
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.myBackground.secondary,
  borderRadius: theme.spacing(2),
}));

const DescriptionHeading = styled("h3")(({ theme }) => ({
  margin: "0",
  color: theme.palette.myText.heading,
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.myBackground.main,
}));

const DescriptionContent = styled(Box)(({ theme }) => ({
  fontSize: "13px",
  marginTop: theme.spacing(1),
  color: theme.palette.myText.primary,
}));

type Props = {
  story: StoryInterface;
};

const StoryMain = ({ story }: Props) => {
  const router = useRouter();
  const { story_code, page } = router?.query;
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const {
    data: likeNumberData,
    mutate: likeNumberMutate,
    isValidating: likeNumberIsValidating,
  } = useSWR(`/like/getLikeNumber/${story?.story_code}`, {
    revalidateOnMount: false,
  });
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
  }, [story, page]);

  useEffect(() => {
    if (story?.story_description)
      story.story_description = story.story_description
        .replaceAll("<div text-align: justify; >", "")
        .replaceAll("</div>", "");
  }, [story?.story_description]);

  useEffect(() => {
    if (story) {
      chapterListMutate();
      likeNumberMutate();
    }
  }, []);

  return (
    <>
      <Wrapper>THÔNG TIN TRUYỆN</Wrapper>
      <Box className={"hr"} />

      <TitleWrapper>{story?.story_title}</TitleWrapper>

      <Stack
        direction={{ md: "row", xs: "column" }}
        justifyContent={"flex-end"}
        gap={"10px"}
      >
        <ViewedAndImgWrapper>
          <ImgWrapper>
            <CoverImage src={story?.story_cover} alt={story?.story_title} />
            <ViewStyled>
              <RemoveRedEyeIcon />
              <Box component={"span"}>{story?.story_view}</Box>
            </ViewStyled>
          </ImgWrapper>
        </ViewedAndImgWrapper>
        <Stack flexGrow={1}>
          <ULWrapper>
            <UListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <PersonIcon />
                  Tác giả:
                </StoryDetailListLeftBoxStyled>
                <Box
                  component={Link}
                  href={`/search/author?keywords=${story?.story_author}&exact=true`}
                >
                  {story?.story_author}
                </Box>
              </StoryDetailListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <FolderIcon />
                  <Box component={"span"}>Thể loại:</Box>
                </StoryDetailListLeftBoxStyled>
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
                          "&>span": { color: "myText.main" },
                          backgroundColor: "myBackground.main",
                        }}
                      />
                    );
                  })}
                </Box>
              </StoryDetailListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <ArrowForwardIosIcon />
                  Nguồn:
                </StoryDetailListLeftBoxStyled>
                {story?.story_source}
              </StoryDetailListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <StarIcon />
                  Trạng thái:
                </StoryDetailListLeftBoxStyled>
                {story?.story_status}
              </StoryDetailListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <UpdateIcon />
                  Update lần cuối:
                </StoryDetailListLeftBoxStyled>
                {story?.updated_at && (
                  <>{`${timeSince(
                    Math.abs(
                      new Date().valueOf() -
                        new Date(story?.updated_at).valueOf()
                    )
                  )} trước`}</>
                )}
              </StoryDetailListStyled>
              <StoryDetailListStyled>
                <StoryDetailListLeftBoxStyled>
                  <FavoriteIcon />
                  Số lượt thích:
                </StoryDetailListLeftBoxStyled>
                {likeNumberData?.result?.number}
              </StoryDetailListStyled>
            </UListStyled>
            <ButtonWrapper>
              <StoryLikeButton
                story_code={story?.story_code}
                likeNumberMutate={likeNumberMutate}
                likeNumberData={likeNumberData}
              />

              <StoryCommentButton story_code={story?.story_code} />
              <StoryReportButton
                open={reportModalOpen}
                setOpen={setReportModalOpen}
                story_code={story?.story_code}
              />
            </ButtonWrapper>
          </ULWrapper>
        </Stack>
      </Stack>

      <DescriptionWrapper>
        <DescriptionHeading>Mô tả truyện</DescriptionHeading>
        {story?.story_description && (
          <DescriptionContent
            dangerouslySetInnerHTML={{
              __html:
                story?.story_description.length >= 400
                  ? showMore
                    ? story?.story_description
                    : story?.story_description.substring(0, 400) + "..."
                  : story?.story_description,
            }}
          ></DescriptionContent>
        )}
        {story?.story_description && story?.story_description.length >= 400 ? (
          <Stack direction={"row"} justifyContent={"center"}>
            <IconButton
              onClick={() => setShowMore(!showMore)}
              size="small"
              title={showMore ? "Rút gọn" : "Xem thêm"}
            >
              {showMore ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Stack>
        ) : null}
      </DescriptionWrapper>

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

export default StoryMain;
