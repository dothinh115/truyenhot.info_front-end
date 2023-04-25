import { CategoriesSidebar, SameAuthorSidebar } from "../sidebar";

type Props = {};

export const StorySidebar = (props: Props) => {
  return (
    <>
      <SameAuthorSidebar />
      <CategoriesSidebar />
    </>
  );
};
