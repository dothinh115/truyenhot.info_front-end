import { SectionInterface } from "@/models";
import Box from "@mui/material/Box";

export const StorySection = ({ children }: SectionInterface) => {
  return (
    <>
      <Box component={"section"} mt={5}>
        {children}
      </Box>
    </>
  );
};
