import React from "react";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import useSWR from "swr";
import { CategoryInterface } from "@/models/categories";

type Props = {};
export const CategoriesSidebar = (props: Props) => {
  const { data: categoriesList, isLoading } = useSWR("/categories/getAll", {
    dedupingInterval: 60 * 60 * 24,
  });
  return (
    <Stack spacing={2}>
      <Box
        bgcolor={"#e8eaf669"}
        sx={{
          border: "1px solid #ccc",
        }}
      >
        <Box component={"h3"} bgcolor={"#e8eaf6"} my={0} p={1}>
          THỂ LOẠI
        </Box>
        <Box className={"sidebar-hr"}></Box>
        {isLoading ? (
          <Box textAlign={"center"}>Loading...</Box>
        ) : (
          <Box
            component={"ul"}
            sx={{
              p: 0,
              my: 0,
              mb: 1,
              "& > li": {
                listStyleType: "none",
                display: "inline-block",
                width: "50%",
                pl: 1,
                m: 0,
                borderBottom: "1px dashed #ccc",
                height: "30px",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                "& > a": {
                  display: "block",
                  height: "100%",
                  lineHeight: "30px",
                  textDecoration: "none",
                  color: "#303f9f",
                  textAlign: "center",
                },
                "&:nth-of-type(odd)": {
                  borderRight: "1px dashed #ccc",
                },
              },
            }}
          >
            {categoriesList?.result.map((cate: CategoryInterface) => {
              return (
                <Box key={cate.cate_id} component={"li"}>
                  <Box component={Link} href={`/categories/${cate.cate_code}`}>
                    {cate.cate_title}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Stack>
  );
};
