import { Footer } from "@/components/footer/footer";
import Box from "@mui/material/Box";

type Props = {};

const FooterSection = (props: Props) => {
  return (
    <>
      <Box component={"footer"} mt={4}>
        <Footer />
      </Box>
    </>
  );
};

export default FooterSection;
