import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";

import { MainLayoutContext } from "@/layouts";
import { CategoryInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import { thumbnailUrl } from "@/utils/variables";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack } from "@mui/material";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext } from "react";

const BaseStats = dynamic(() => import("../components/home/baseStats"));
const HomeFullStories = dynamic(() => import("../components/home/fullStories"));
const HomeHotStories = dynamic(() => import("../components/home/hotStories"));
const IndexRecentStories = dynamic(
  () => import("../components/home/recentStories")
);
const CategoriesSidebar = dynamic(
  () => import("../components/sidebar/categories")
);
const ReadingStoriesHistory = dynamic(
  () => import("../components/sidebar/readingStories")
);

type Props = {
  categories: CategoryInterface[];
};

const Index = ({ categories }: Props) => {
  useContext<any>(MainLayoutContext);
  const breadCrumbs = [
    <Stack
      key={1}
      direction={"row"}
      component={Link}
      href="/"
      alignItems={"center"}
      fontSize={{
        md: "1rem",
        xs: ".8rem",
      }}
      scroll={true}
    >
      <HomeIcon />
    </Stack>,
  ];

  return (
    <>
      <Seo
        data={{
          title: `Đọc truyện online, truyện hay, truyện hot, truyện full, truyện mới nhất, truyenhot.info`,
          description: `Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info`,
          thumbnailUrl,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={4}>
        <Container maxWidth={"md"}>
          <HomeHotStories categories={categories} />
          <Stack
            direction={"row"}
            gap={"15px"}
            flexWrap={{
              xs: "wrap",
              md: "nowrap",
            }}
            mt={3}
          >
            <Box
              width={{
                md: "70%",
                xs: "100%",
              }}
              maxWidth={{ md: "70%", xs: "100%" }}
            >
              <IndexRecentStories categories={categories} />
            </Box>
            <Box
              width={{
                md: "30%",
                xs: "100%",
              }}
            >
              <ReadingStoriesHistory />
              <CategoriesSidebar categories={categories} />
              {/* <BaseStats /> */}
            </Box>
          </Stack>
          <HomeFullStories categories={categories} />
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

export default Index;
