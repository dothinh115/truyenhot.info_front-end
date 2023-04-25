import { MainBreadcrumbs } from "@/components/breadcrumbs";
import { CategoriesSidebar } from "@/components/sidebar";
import { MainLayoutContext } from "@/layouts";
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
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import useSWR from "swr";
type Props = {
  categoryData: CategoryInterface;
};

const CategoriesDetail = ({ categoryData }: Props) => {
  const router = useRouter();
  const { page } = router.query;
  const cate_code = categoryData?.cate_code;
  const cate_title = categoryData?.cate_title;
  const {
    data: storiesData,
    mutate: storiesMutate,
    isLoading,
  } = useSWR(
    `/categories/getStoriesByCategory/${cate_code}${
      page ? `?page=${page}` : ""
    }`,
    {
      revalidateOnMount: false,
    }
  );

  const { setLoading } = useContext<any>(MainLayoutContext);
  const [paginationPage, setPaginationPage] = useState<number>(1);

  useEffect(() => {
    if (page) setPaginationPage(+page);
    if (cate_code) storiesMutate();
  }, [page, cate_code]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={2}>
        <Container maxWidth={"md"}>
          <Stack direction={"row"} spacing={1}>
            <Box
              width={{
                xs: "100%",
                md: "70%",
              }}
            >
              <Box component={"h1"} m={0} fontWeight={"light"} fontSize={35}>
                {cate_title}
              </Box>
              <Box className={"hr"} my={2} />
              <Box component={"ul"} m={0} p={0}>
                {storiesData?.result.map(
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
                  count={storiesData?.pagination.pages}
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
            >
              <CategoriesSidebar />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("http://localhost:5000/api/categories/getAll");
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
    const respone = await fetch(
      `http://localhost:5000/api/categories/getCategoryDetail/${cate_code}`
    );
    const category = await respone.json();
    return {
      props: {
        categoryData: category.result,
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
