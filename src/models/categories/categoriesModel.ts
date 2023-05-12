export interface CategoryInterface {
  _id: string;
  cate_id: number;
  cate_title: string;
  cate_code: string;
}

export interface StoriesInCategoryInterface {
  _id: string;
  story_title: string;
  story_rating: number;
  story_author: string;
  story_status: string;
  story_cover: string;
  story_code: string;
  _count: number;
}
