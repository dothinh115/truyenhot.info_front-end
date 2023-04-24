import React from "react";
import { Stack, Container, Box, Typography } from "@mui/material";
import { CategoriesSidebar } from "@/components/sidebar";
import { MainBreadcrumbs } from "@/components/breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

type Props = {};

const CategoriesDetail = (props: Props) => {
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
      abc
    </Typography>,
  ];
  return (
    <>
      <MainBreadcrumbs links={breadCrumbs} />
      <Stack direction={"row"} justifyContent={"center"} mt={2}>
        <Container maxWidth={"md"}>
          <Stack direction={"row"} spacing={1}>
            <Box width={"70%"}>abc</Box>
            <Box width={"30%"}>
              <CategoriesSidebar />
            </Box>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default CategoriesDetail;
