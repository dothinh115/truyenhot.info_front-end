import { Header } from "@/components/header";
import { Box } from "@mui/material";

type Props = {};

const HeaderSection = (props: Props) => {
  return (
    <>
      <Box component={"header"} width={"100%"}>
        <Header />
      </Box>
    </>
  );
};
export default HeaderSection;
