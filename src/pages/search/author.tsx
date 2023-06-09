import { CategoryInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import { thumbnailUrl } from "@/utils/variables";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Seo } from "@/components/seo";
import { MainBreadcrumbs } from "@/components/breadcrumbs/mainBreadcrumbs";
import { StoryListLoading } from "@/components/loading/storyListLoading";
const RowStory = dynamic(() => import("../../components/categories/storyList"));
const CategoriesSidebar = dynamic(
  () => import("../../components/sidebar/categories")
);
type Props = { categories: CategoryInterface[] };

const SearchByAuthorPage = ({ categories }: Props) => {
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const router = useRouter();
  const { keywords, page, exact } = router.query;

  const {
    data: searchData,
    mutate: searchMutate,
    isValidating: searchIsValidating,
  } = useSWR(
    `/search/storyAuthor?keywords=${keywords}${page ? `&page=${page}` : ""}${
      exact ? "&exact=true" : ""
    }`,
    {
      revalidateOnMount: false,
    }
  );

  const cateListPreRender = () => {
    const result = [];
    for (let i = 0; i < 20; i++) {
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
      <Seo
        data={{
          title: `Tìm kiếm: ${keywords}`,
          description: `Kết quả tìm kiếm từ khóa ${keywords} tại truyenhot.info. Chúc bạn có những phút giây thư giãn!`,
          url: `https//truyenhot.info/search/author?keywords=${keywords}${
            exact ? "&exact=true" : ""
          }`,
          thumbnailUrl,
        }}
      />
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
              <Box
                component={"h1"}
                m={0}
                fontWeight={"light"}
                fontSize={{
                  md: 30,
                  xs: 20,
                }}
                color={"myText.primary"}
              >
                Kết quả tìm kiếm từ khóa: {keywords}
              </Box>
              <Box className={"hr"} my={2} />
              {searchIsValidating ? (
                cateListPreRender()
              ) : (
                <RowStory storiesData={searchData} />
              )}
              <Stack direction={"row"} justifyContent={"center"} mt={2}>
                <Pagination
                  count={searchData?.pagination?.pages}
                  page={paginationPage}
                  color="primary"
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

export default SearchByAuthorPage;
