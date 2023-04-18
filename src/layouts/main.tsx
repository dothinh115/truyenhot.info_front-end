import { MainLayoutInterface } from "@/models";
import { HeaderSection } from "@/sections";
import { Box } from "@mui/system";

export const MainLayout = ({ children }: MainLayoutInterface) => {
  //444 - 600 - 900 - 1200
  return (
    <>
      <HeaderSection />
      {children}
    </>
  );
};
