import { CategoryInterface } from "@/models/categories";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { styled, alpha } from "@mui/material/styles";

const Wrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  boxShadow: `0 0 2px ${alpha(theme.palette.mySecondary.boxShadow, 0.2)}`,
}));

const Heading = styled("h2")(({ theme }) => ({
  margin: "0",
  padding: theme.spacing(1),
  color: theme.palette.myText.main,
  fontWeight: 600,
  backgroundColor: theme.palette.myBackground.main,
  borderBottom: `1px dashed ${theme.palette.mySecondary.main}`,
  textTransform: "uppercase",
  fontSize: "14px",
}));

const UList = styled("ul")(({ theme }) => ({
  padding: "0",
  margin: 0,
  backgroundColor: theme.palette.myBackground.secondary,
}));

const ListItem = styled("li")(({ theme }) => ({
  listStyleType: "none",
  display: "inline-block",
  width: "50%",
  margin: 0,
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
  height: "30px",
  "& > a": {
    display: "block",
    height: "100%",
    lineHeight: "30px",
    textDecoration: "none",
    color: theme.palette.myText.link,
    textAlign: "center",
  },
  "&:nth-of-type(odd)": {
    borderRightWidth: "1px",
    borderRightStyle: "dashed",
    borderRightColor: theme.palette.mySecondary.main,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
}));

type Props = {
  categories: CategoryInterface[];
};

const CategoriesSidebar = ({ categories }: Props) => {
  return (
    <>
      <Stack spacing={2}>
        <Wrapper>
          <Heading>Thể loại</Heading>

          <UList>
            {categories?.map((cate: CategoryInterface) => {
              return (
                <ListItem key={cate.cate_id}>
                  <Box
                    component={Link}
                    href={`/categories/${cate.cate_code}`}
                    title={cate.cate_title}
                  >
                    {cate.cate_title}
                  </Box>
                </ListItem>
              );
            })}
          </UList>
        </Wrapper>
      </Stack>
    </>
  );
};

export default CategoriesSidebar;
