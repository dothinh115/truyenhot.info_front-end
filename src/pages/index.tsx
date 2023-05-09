import { Seo } from "@/components";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import {
  BaseStats,
  IndexCarousel,
  IndexRecentStories,
} from "@/components/home";
import { CategoriesSidebar } from "@/components/sidebar";
import { CategoryInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Container, Stack } from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";

type Props = {
  categories: CategoryInterface[];
  stats: StatsType;
};

type StatsType = {
  totalStories: number;
  totalViews: number;
  totalChapters: number;
};

const Index = ({ categories, stats }: Props) => {
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
  ];

  return (
    <>
      <Seo
        data={{
          title: `Đọc truyện online, truyện hay, truyện hot, truyện full, truyện mới nhất, truyenhot.info`,
          description: `Đọc truyện online, đọc truyện chữ, truyện hay, truyện hot. Luôn cập nhật truyện nhanh nhất.`,
          url: `https//truyenhot.info`,
          thumbnailUrl: `${apiURL}/api/public/images/thumnail/thumbnail.jpg`,
        }}
      />
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={4}>
        <Container maxWidth={"md"}>
          <IndexCarousel categories={categories} />
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
            >
              <IndexRecentStories categories={categories} />
            </Box>
            <Box
              width={{
                md: "30%",
                xs: "100%",
              }}
            >
              <CategoriesSidebar categories={categories} />
              <BaseStats stats={stats} />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const revalidate = 1 * 60 * 60;
  const baseStatsResponse = await fetch(`${apiURL}/api/stats/getBaseStats`);
  const categoriesResponse = await fetch(`${apiURL}/api/categories/getAll`);
  const baseStats = await baseStatsResponse.json();

  const categories = await categoriesResponse.json();

  return {
    props: {
      categories: categories.result,
      stats: baseStats.result,
    },
    revalidate,
  };
};

export default Index;
