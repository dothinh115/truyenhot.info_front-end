import { CategoryInterface } from "../categories";

export interface StoryInterface {
  _id: string;
  story_title: string;
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
  chapter_code: string;
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

export interface ReadingStoriesInterface {
  story_title: string;
  story_code: string;
  chapter_code: string;
  chapter_name: string;
}

export interface CheckIfLikedInterface {
  message?: string;
  result: CheckIfLikedResultInterface;
}

interface CheckIfLikedResultInterface {
  like: boolean;
}

export interface NumberOfLikeInterface {
  message: string;
  result: NumberOfLikeResultInterface;
}

interface NumberOfLikeResultInterface {
  number: boolean;
}

export interface CommentDataInterface {
  _id: string;
  story_code: string;
  comment_content: string;
  created_at: Date;
  author: CommentAuthorInterface;
  totalSubCmtPages: number;
}

export interface SubCommentDataInterface {
  _id: string;
  parent_id: string;
  comment_content: string;
  created_at: Date;
  author: CommentAuthorInterface;
  to: SubCommentReplyToInterface;
}

interface SubCommentReplyToInterface {
  _id: string;
  user_id: string;
  gender: "male" | "female";
}

interface CommentAuthorInterface {
  _id: string;
  user_id: string;
  gender: "male" | "female";
}
