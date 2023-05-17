import { Header } from "@/components/header";
import { Box } from "@mui/material";

type Props = {};

export const HeaderSection = (props: Props) => {
  return (
    <>
      <Box component={"header"} width={"100%"}>
        <Header />
      </Box>
    </>
  );
};
