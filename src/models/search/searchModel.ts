export interface SearchDataInterface {
  message: string;
  result: StoriesSearchResultInterface[];
  pagination: Pagination;
}

export interface StoriesSearchResultInterface {
  _id: string;
  story_title: string;
  story_author: string;
  story_status: string;
  story_cover: string;
  story_code: string;
  _count: number;
}

export interface HotStoriesInCategoriesInterface {
  _id: string;
  story_title: string;
  story_code: string;
}

interface Pagination {
  total: number;
  perPage: number;
  pages: number;
}
