import Box from "@mui/material/Box";
import { Footer } from "@/components/footer";

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
