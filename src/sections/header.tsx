import { HeaderDesktop, HeaderMobile } from "@/components/header/index";
import { Box } from "@mui/material";

type Props = {};

export const HeaderSection = (props: Props) => {
  return (
    <>
      <Box
        component={"header"}
        width={"100%"}
        bgcolor={"#311b92"}
        height="50px"
      >
        <HeaderDesktop />
        <HeaderMobile />
      </Box>
    </>
  );
};
