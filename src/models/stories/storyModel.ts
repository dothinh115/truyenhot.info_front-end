import { CategoryInterface } from "../categories";

export interface StoryInterface {
  _id: string;
  story_title: string;
  story_rating: number;
  story_description?: string;
  story_author: string;
  story_status: string;
  story_source: string;
  story_cover: string;
  story_category: CategoryInterface[];
  story_code: string;
  story_view: number;
  story_label: string;
  updated_at: Date;
  start_chapter: string;
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

export interface ReportOptionInterface {
  _id: string;
  report_title: string;
}

export interface NewReportInterface {
  report_title: string;
  report_description: string;
  story_code: string;
}

export interface ReportInterface {
  _id: string;
  report_title: string;
  report_description: string;
  story_code: string;
  created_at: Date;
  handled: boolean;
}

export interface ReportOptionInterface {
  _id: string;
  report_title: string;
}
