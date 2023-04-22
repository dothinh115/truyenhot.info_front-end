import { MainLoading } from "@/components/loading";
import { MainLayoutInterface } from "@/models";
import { FooterSection, HeaderSection } from "@/sections";
import { createContext, useState } from "react";

export const MainLayoutContext = createContext({});

export const MainLayout = ({ children }: MainLayoutInterface) => {
  const [loading, setLoading] = useState<boolean>(false);

  //444 - 600 - 900 - 1200
  return (
    <>
      <MainLayoutContext.Provider value={{ loading, setLoading }}>
        <MainLoading open={loading} />
        <HeaderSection />
        {children}
        <FooterSection />
      </MainLayoutContext.Provider>
    </>
  );
};
