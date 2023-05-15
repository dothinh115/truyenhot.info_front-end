import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { RowStory } from "@/components/categories";
import { StoryListLoading } from "@/components/loading";
import { CategoriesSidebar, HotStoriesInCate } from "@/components/sidebar";
import { CategoryInterface } from "@/models/categories";
import { HotStoriesInCategoriesInterface } from "@/models/search";
import { apiURL } from "@/utils/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  categoryData: CategoryInterface;
  categories: CategoryInterface[];
  hotStoriesInCategory: HotStoriesInCategoriesInterface[];
};

const CategoriesDetail = ({
  categoryData,
  categories,
  hotStoriesInCategory,
}: Props) => {
  const router = useRouter();
  const { page } = router.query;
  const cate_code = categoryData?.cate_code;
  const cate_title = categoryData?.cate_title;
  const {
    data: storiesData,
    mutate: storiesMutate,
    isValidating: storiesIsValidating,
  } = useSWR(
    `/categories/getStoriesByCategory/${cate_code}${
      page ? `?page=${page}` : ""
    }`,
    {
      revalidateOnMount: false,
      keepPreviousData: true,
    }
  );

  const [paginationPage, setPaginationPage] = useState<number>(1);

  const cateListPreRender = () => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      result.push(<StoryListLoading key={i} />);
    }
    return result;
  };

  useEffect(() => {
    if (page) setPaginationPage(+page);
    else setPaginationPage(1);
  }, [page, cate_code]);

  useEffect(() => {
    if (cate_code) storiesMutate();
  }, []);

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
      {cate_title}
    </Typography>,
  ];

  return (
    <>
      <Seo
        data={{
          title: `Truyện ${cate_title} - truyenhot.info`,
          description: `Truyện ${cate_title} - Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info/categories/${cate_code}`,
          thumbnailUrl: `${apiURL}/api/public/images/thumnail/thumbnail.jpg`,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={2}>
        <Container maxWidth={"md"}>
          <Stack direction={"row"} flexWrap={"wrap"} gap={1} width={"100%"}>
            <Box
              width={{
                xs: "100%",
                md: "68%",
              }}
            >
              <Box
                component={"h1"}
                m={0}
                fontWeight={"light"}
                fontSize={35}
                color={"myText.primary"}
              >
                {cate_title}
              </Box>
              <Box className={"hr"} my={2} />
              {storiesIsValidating ? (
                cateListPreRender()
              ) : (
                <RowStory storiesData={storiesData} />
              )}
              <Stack direction={"row"} justifyContent={"center"} mt={2}>
                <Pagination
                  count={storiesData?.pagination.pages}
                  page={paginationPage}
                  color="primary"
                  onChange={(e, p) =>
                    router.push(
                      {
                        pathname: router.pathname,
                        query: {
                          cate_code,
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
                xs: "none",
                md: "block",
              }}
              m={"0!important"}
            >
              <CategoriesSidebar categories={categories} />
              <HotStoriesInCate
                category={categoryData}
                hotStoriesInCategory={hotStoriesInCategory}
              />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`${apiURL}/api/categories/getAll`);
  const data = await response.json();
  const paths = data.result.map((item: CategoryInterface) => ({
    params: {
      cate_code: item.cate_code,
    },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (
  context: GetStaticPropsContext
) => {
  if (!context.params)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  try {
    const cate_code = context.params.cate_code;
    const revalidate = 60 * 60 * 24;
    const cateDetailResponse = await fetch(
      `${apiURL}/api/categories/getCategoryDetail/${cate_code}`
    );
    const category = await cateDetailResponse.json();
    const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
    const categories = await categoriesResponse.json();
    const hotStoriesInCategoryResponse = await fetch(
      `${apiURL}/api/stories/getHotStoriesNoCover?category=${cate_code}`
    );
    const hotStoriesInCategory = await hotStoriesInCategoryResponse.json();
    return {
      props: {
        categoryData: category.result,
        categories: categories.result,
        hotStoriesInCategory: hotStoriesInCategory.result,
      },
      revalidate,
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default CategoriesDetail;
