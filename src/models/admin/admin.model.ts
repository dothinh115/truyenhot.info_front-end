import { StoryInterface } from "../stories";

export interface AdminDataStatsInterface {
  totalStories: number;
  totalViews: number;
  totalChapters: number;
  noCoverStoriesList: StoryInterface[];
}
