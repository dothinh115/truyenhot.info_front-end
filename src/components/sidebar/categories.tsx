import { CategoryInterface } from "@/models/categories";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";

type Props = {
  categories: CategoryInterface[];
};
export const CategoriesSidebar = ({ categories }: Props) => {
  return (
    <Stack spacing={2}>
      <Box
        bgcolor={"#fff"}
        borderRadius={"15px"}
        overflow={"hidden"}
        border={"1px dashed #7986cba6"}
        mb={2}
      >
        <Box
          component={"h3"}
          m={"4px 4px 0 4px"}
          px={2}
          py={1}
          borderBottom={"1px dashed #7986cba6"}
          color={"#fff"}
          fontWeight={"500"}
          bgcolor={"#7986cbc2"}
          borderRadius={"10px 10px 0 0"}
        >
          Thể loại
        </Box>

        <Box
          component={"ul"}
          sx={{
            p: 0,
            my: 0,
            mb: 0,
            "& > li": {
              listStyleType: "none",
              display: "inline-block",
              width: "50%",
              pl: 1,
              m: 0,
              borderBottom: "1px dashed #7986cba6",
              height: "30px",
              "&:hover": "unset",
              "& > a": {
                display: "block",
                height: "100%",
                lineHeight: "30px",
                textDecoration: "none",
                color: "#303f9f",
                textAlign: "center",
              },
              "&:nth-of-type(odd)": {
                borderRight: "1px dashed #7986cba6",
              },
            },
          }}
        >
          {categories?.map((cate: CategoryInterface) => {
            return (
              <Box key={cate.cate_id} component={"li"}>
                <Box
                  component={Link}
                  href={`/categories/${cate.cate_code}`}
                  title={cate.cate_title}
                >
                  {cate.cate_title}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
};
