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
      bgcolor={"background.secondary"}
      py={1}
    >
      <Container maxWidth={"md"}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            "& li": {
              maxWidth: "50%",
              overFlow: "hidden",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "& a": {
                color: "text.secondary",
              },
              color: "text.secondary",
            },
          }}
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Container>
    </Stack>
  );
};
