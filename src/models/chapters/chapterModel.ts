export interface ChapterListInterface {
  _id: string;
  chapter_id: number;
  chapter_name: string;
  chapter_title: string;
  chapter_code: string;
  story_code: string;
  created_at: Date;
}

export interface ChapterDataInterface extends ChapterListInterface {
  chapter_content: string;
  story_title: string;
  nextChapter?: string;
  prevChapter?: string;
}
