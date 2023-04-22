import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Container, Stack } from "@mui/material";

type Props = {
  links: any[];
};

export const MainBreadcrumbs = ({ links }: Props) => {
  const breadcrumbs = [...links];

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      bgcolor={"#e0e0e0"}
      py={1}
    >
      <Container maxWidth={"md"}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Container>
    </Stack>
  );
};
