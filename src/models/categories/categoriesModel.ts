export interface CategoryInterface {
  _id: string;
  cate_id: number;
  cate_title: string;
  cate_code: string;
}

export interface StoriesInCategoryInterface {
  _id: string;
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
  updated_at: Date;
}

export interface _Count {
  chapter: number;
}
