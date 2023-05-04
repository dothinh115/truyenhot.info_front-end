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
        borderRadius={"6px"}
        overflow={"hidden"}
        border={"1px solid rgb(224 224 224)"}
        mb={2}
      >
        <Box
          component={"h4"}
          sx={{
            bgcolor: "primary.main",
          }}
          my={0}
          p={"5px 12px"}
          color={"primary.contrastText"}
        >
          Thể loại
        </Box>

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
              borderBottom: "1px dashed #e0e0e0",
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
                borderRight: "1px dashed #e0e0e0",
              },
            },
          }}
        >
          {categories?.map((cate: CategoryInterface) => {
            return (
              <Box key={cate.cate_id} component={"li"}>
                <Box component={Link} href={`/categories/${cate.cate_code}`}>
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
