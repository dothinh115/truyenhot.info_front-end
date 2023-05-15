import { CategoryInterface } from "@/models/categories";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { styled } from "@mui/material/styles";

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.myBackground.default,
  borderRadius: "15px",
  overflow: "hidden",
  borderWidth: "1px",
  borderStyle: "dashed",
  borderColor: theme.palette.mySecondary.main,
  marginBottom: theme.spacing(2),
  padding: "6px",
}));

const Heading = styled("h3")(({ theme }) => ({
  margin: "0",
  padding: theme.spacing(1),
  borderBottomWidth: "1px",
  borderBottomStyle: "dashed",
  borderBottomColor: theme.palette.mySecondary.main,
  color: theme.palette.myText.main,
  fontWeight: 500,
  backgroundColor: theme.palette.myBackground.main,
  borderRadius: "10px 10px 0 0",
  borderWidth: "1px 1px 0 1px",
  borderStyle: "solid",
  borderColor: theme.palette.myBackground.main,
}));

const UList = styled("ul")(({ theme }) => ({
  padding: "0",
  margin: 0,
  borderWidth: "0 1px 1px 1px",
  borderStyle: "solid",
  borderColor: theme.palette.myBackground.main,
  borderRadius: "0 0 10px 10px",
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
  backgroundColor: theme.palette.myBackground.secondary,
  "&:hover": "unset",
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
      borderRadius: "0 0 0 10px",
    },
  },
  "&:nth-of-type(even)": {
    "&:last-of-type": {
      borderBottom: "none",
      borderRadius: "0 0 10px 0",
    },
  },
}));

type Props = {
  categories: CategoryInterface[];
};

export const CategoriesSidebar = ({ categories }: Props) => {
  return (
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
  );
};
