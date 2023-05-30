import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

type Props = {
  links: any[];
};

export const MainBreadcrumbs = ({ links }: Props) => {
  const breadcrumbs = [...links];

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      bgcolor={"myBackground.paper"}
      py={1}
      sx={{ transition: "all .2s" }}
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
              "&>a, &>span": {
                color: "myText.secondary",
                fontSize: ".9em",
              },
              color: "myText.secondary",
              "&.MuiBreadcrumbs-separator": {
                margin: "0",
              },
            },
          }}
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Container>
    </Stack>
  );
};
