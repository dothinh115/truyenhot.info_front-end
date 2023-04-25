import { CategoryInterface } from "../categories";

export interface SearchDataInterface {
  message: string;
  result: StoriesSearchResultInterface[];
  pagination: Pagination;
}

export interface StoriesSearchResultInterface {
  story_id: number;
  story_title: string;
  story_rating: number;
  story_author: string;
  story_status: string;
  story_source: string;
  story_cover: string;
  story_category: CategoryInterface[];
  poster: number;
  story_code: string;
  _count: _Count;
}

interface _Count {
  chapter: number;
}

interface Pagination {
  total: number;
  perPage: number;
  pages: number;
}
