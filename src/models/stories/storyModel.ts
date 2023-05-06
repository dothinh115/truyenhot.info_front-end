import { CategoryInterface } from "../categories";

export interface StoryInterface {
  story_id: number;
  story_title: string;
  story_rating: number;
  story_description?: string;
  story_author: string;
  story_status: string;
  story_source: string;
  story_cover: string;
  story_category: CategoryInterface[];
  poster: number;
  story_code: string;
  story_view: number;
  story_label: string;
  created_at: Date;
  updated_at: Date | string;
}

export interface UpdateStoryInterface {
  story_title?: string;
  story_description?: string;
  story_category?: CategoryInterface[];
  story_author?: string;
  story_source?: string;
  story_status?: string;
  cover_img?: File | null;
}

export interface NewStoryInterface {
  story_title: string;
  story_description: string;
  story_author: string;
  story_source: string;
  story_category: CategoryInterface[];
  cover_img?: any;
}
