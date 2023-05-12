import { CategoryInterface } from "@/models/categories";
import { ChapterDataInterface } from "@/models/chapters";
import { StoryInterface } from "@/models/stories";
import { timeSince } from "@/utils/function";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Box,
  Button,
  List,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
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
import { RowLoading } from "../loading";
import { StoryReportButton } from "./reportButton";
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
      <Box>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          component={"h3"}
          mt={0}
        >
          THÔNG TIN TRUYỆN
          <StoryReportButton
            open={reportModalOpen}
            setOpen={setReportModalOpen}
            story_code={story?.story_code}
          />
        </Stack>
        <Box className={"hr"} />
        <Box component={"h1"} textAlign={"center"}>
          {story?.story_title}
        </Box>
        <Box textAlign={"center"}>
          <Box
            component={"img"}
            src={story?.story_cover}
            width={215}
            alt={story?.story_title}
          />
        </Box>
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
        <Stack>
          <Box
            component={"ul"}
            sx={{
              listStyleType: "none",
              pl: 0,
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
                my: 0,
              },
              "& > li": {
                lineHeight: "30px",
                "&:not(:last-child)": {
                  borderBottom: "1px dashed #ccc",
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
                    mr: 1,
                    mt: "2px",
                  },
                  "& span": {
                    display: "inline-block",
                    width: "60px",
                  },
                },
                "& a": {
                  display: "inline-block",
                  lineHeight: "30px",
                },
              },
              "& > li > ul": {
                display: "inline-block",
                pl: 1,
              },
              "& span a": {
                mr: "4px",
                "&::after": {
                  content: '","',
                  display: "inline-block",
                  ml: "2px",
                },
              },
            }}
          >
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
                    <Box
                      component={Link}
                      key={cate.cate_id}
                      href={`/categories/${cate.cate_code}`}
                    >
                      {cate.cate_title}
                    </Box>
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
            <Box component={"li"}>
              <Box component={"h4"}>
                <RemoveRedEyeIcon />
                Lượt xem:
              </Box>
              {story?.story_view}
            </Box>
          </Box>
        </Stack>
        <Box className={"hr"}></Box>
        {story?.story_description && (
          <Box
            component={"div"}
            sx={{
              my: 2,
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

        <Box textAlign={"right"} my={2}>
          <Button
            type="button"
            variant="contained"
            color="info"
            onClick={() => setShowMore(!showMore)}
            size="small"
          >
            {showMore ? "Rút gọn" : "Xem thêm"}
          </Button>
        </Box>
        <Stack
          component={"h1"}
          fontSize={20}
          direction={"row"}
          gap={"5px"}
          alignItems={"center"}
          id="chapter-list"
        >
          DANH SÁCH CHƯƠNG
          {chapterListIsValidating && (
            <CircularProgress size={"1em"} color="primary" />
          )}
        </Stack>
        <Box className={"hr"} />
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

        <Box
          component={List}
          maxHeight={{
            md: 600,
            xs: "100%",
          }}
          height={{
            md: 600,
            xs: "100%",
          }}
          overflow={"auto"}
          mt={3}
          bgcolor={"#fff"}
          dense={true}
        >
          {chapterListIsValidating
            ? paginationRowLoading()
            : chapterListData?.result.map((data: ChapterDataInterface) => {
                return (
                  <ListItem
                    key={data._id}
                    sx={{
                      borderBottom: "1px dashed #ccc",
                      px: 1,
                    }}
                    dense={true}
                  >
                    <Box component={ListItemIcon} minWidth={"25px"}>
                      <ArrowCircleRightIcon />
                    </Box>
                    <ListItemButton
                      component={Link}
                      href={`/story/${story_code}/${data.chapter_code}`}
                      sx={{
                        px: 1,
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
        </Box>
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
      </Box>
    </>
  );
};
