import { StoryInterface } from "@/models/stories";
import { CategoriesSidebar, SameAuthorSidebar } from "../sidebar";

type Props = { story: StoryInterface };

export const StorySidebar = ({ story }: Props) => {
  return (
    <>
      <SameAuthorSidebar story={story} />
      <CategoriesSidebar />
    </>
  );
};
