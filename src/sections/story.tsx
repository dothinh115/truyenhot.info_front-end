import { SectionInterface } from "@/models";
import { Box } from "@mui/system";

export const StorySection = ({ children }: SectionInterface) => {
  return (
    <>
      <Box component={"section"} pt={3}>
        {children}
      </Box>
    </>
  );
};
