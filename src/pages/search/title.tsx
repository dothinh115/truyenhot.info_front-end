import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { CategoriesSidebar } from "@/components/sidebar";
import {
  CategoryInterface,
  StoriesInCategoryInterface,
} from "@/models/categories";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreateIcon from "@mui/icons-material/Create";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import useSWR from "swr";
import CircularProgress from "@mui/material/CircularProgress";
import { GetStaticProps } from "next";
import { apiURL } from "@/utils/config";
import { MainLayoutContext } from "@/layouts";
import { StoryListLoading } from "@/components/loading";

type Props = { categories: CategoryInterface[] };

const SearchByTitlePage = ({ categories }: Props) => {
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const router = useRouter();
  const { keywords, page, isFallback } = router.query;
  const { setLoading } = useContext<any>(MainLayoutContext);
  useEffect(() => {
    setLoading(isFallback);
  }, [isFallback]);

  const {
    data: searchData,
    mutate: searchMutate,
    isValidating: searchIsValidating,
  } = useSWR(
    `/search/storyTitle?keywords=${keywords}${page ? `&page=${page}` : ""}`,
    {
      revalidateOnMount: false,
    }
  );

  const cateListPreRender = () => {
    const result = [];
    for (let i = 0; i < 2; i++) {
      result.push(<StoryListLoading key={i} />);
    }
    return result;
  };

  useEffect(() => {
    if (keywords) searchMutate();
  }, [keywords]);

  useEffect(() => {
    if (page) {
      setPaginationPage(+page);
      searchMutate();
    }
  }, [page]);

  const breadCrumbs = [
    <Box
      key={1}
      component={Link}
      href="/"
      display={"flex"}
      alignItems={"center"}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
      scroll={true}
    >
      <HomeIcon />
    </Box>,
    <Typography
      fontSize={{
        md: "1rem",
        xs: ".9rem",
      }}
      key="3"
    >
      {keywords}
    </Typography>,
  ];
  return (
    <>
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={2}>
        <Container maxWidth={"md"}>
          <Stack direction={"row"} spacing={1}>
            <Box
              width={{
                md: "70%",
                xs: "100%",
              }}
            >
              <Box component={"h1"} m={0} fontWeight={"light"} fontSize={30}>
                Kết quả tìm kiếm từ khóa: {keywords}
              </Box>
              <Box className={"hr"} my={2} />
              {searchIsValidating ? (
                cateListPreRender()
              ) : (
                <>
                  <Box component={"ul"} m={0} p={0}>
                    {searchData?.result.length === 0 && "Không có kết quả nào."}
                    {searchData?.result.map(
                      (story: StoriesInCategoryInterface) => {
                        return (
                          <Stack
                            component={"li"}
                            bgcolor={"#fff"}
                            p={1}
                            sx={{
                              border: "1px dashed #ccc",
                            }}
                            direction={"row"}
                            spacing={2}
                            alignItems={"center"}
                            mb={1}
                            key={story.story_code}
                          >
                            <Stack
                              width={"20%"}
                              direction={"row"}
                              alignItems={"center"}
                            >
                              <Box
                                component={"img"}
                                src={story.story_cover}
                                width={"100%"}
                                maxHeight={"70px"}
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
                                }}
                                fontWeight={"bold"}
                              >
                                {story.story_title}
                              </Box>
                              <Typography
                                display={"flex"}
                                alignItems={"center"}
                                fontSize={14}
                                color={"#616161"}
                                sx={{
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
                      }
                    )}
                  </Box>

                  <Stack direction={"row"} justifyContent={"center"} mt={2}>
                    <Pagination
                      count={searchData?.pagination.pages}
                      page={paginationPage}
                      color="primary"
                      showFirstButton={true}
                      showLastButton={true}
                      siblingCount={2}
                      onChange={(e, p) =>
                        router.push(
                          {
                            pathname: router.pathname,
                            query: {
                              keywords,
                              page: p,
                            },
                          },
                          undefined,
                          { scroll: true }
                        )
                      }
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{
                            previous: ArrowBackIcon,
                            next: ArrowForwardIcon,
                          }}
                          {...item}
                        />
                      )}
                    />
                  </Stack>
                </>
              )}
            </Box>
            <Box
              width={"30%"}
              display={{
                md: "block",
                xs: "none",
              }}
            >
              <CategoriesSidebar categories={categories} />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const revalidate = 1 * 60 * 60;
  const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
  const categories = await categoriesResponse.json();

  return {
    props: {
      categories: categories.result,
    },
    revalidate,
  };
};

export default SearchByTitlePage;
