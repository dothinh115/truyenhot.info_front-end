import { MainBreadcrumbs } from "@/components/breadcrumbs/mainBreadcrumbs";
import { Seo } from "@/components/seo";
import { MainLayoutContext } from "@/layouts/main";
import { CategoryInterface } from "@/models/categories";
import { apiURL } from "@/utils/config";
import { thumbnailUrl } from "@/utils/variables";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useContext, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";

const Ads = styled(Box)(() => ({
  backgroundColor: "#fff",
  width: "fit-content",
  margin: "auto",
  marginTop: "20px",
}));
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

  const ads = useRef<HTMLDivElement>();
  const atOptions_md = {
    key: "279b64fd892aecce906091ace21a9db6",
    format: "iframe",
    height: 90,
    width: 728,
    params: {},
  };

  const atOptions_xs = {
    key: "6a1d29a1712c42f55cc21490ee777c91",
    format: "iframe",
    height: 50,
    width: 320,
    params: {},
  };

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
      title="Home"
    >
      <HomeIcon />
    </Stack>,
  ];

  useEffect(() => {
    if (ads.current && !ads.current.firstChild) {
      const config = document.createElement("script");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `//www.highperformancedformats.com/${
        screen.width > 768 ? atOptions_md.key : atOptions_xs.key
      }/invoke.js`;
      config.innerHTML = `atOptions = ${JSON.stringify(
        screen.width > 768 ? atOptions_md : atOptions_xs
      )}`;
      ads.current.append(config);
      ads.current.append(script);
    }
  }, []);

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
          <Ads ref={ads}></Ads>
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
              <BaseStats />
            </Box>
          </Stack>

          <HomeFullStories categories={categories} />
        </Container>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const revalidate = 1 * 60 * 60 * 24;
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
