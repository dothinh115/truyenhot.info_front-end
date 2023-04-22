export interface ChapterListInterface {
  chapter_id: number;
  chapter_name: string;
  chapter_title: string;
  chapter_code: string;
  story_code: string;
}

export interface ChapterDataInterface extends ChapterListInterface {
  chapter_content: string;
  story_title: string;
  nextChapter: string;
  prevChapter: string;
}
