export interface ChapterListInterface {
  _id: string;
  chapter_name: string;
  chapter_code: string;
  story_code: string;
}

export interface ChapterDataInterface extends ChapterListInterface {
  chapter_title: string;
  chapter_content: string;
  story_title: string;
  nextChapter?: string;
  prevChapter?: string;
}
