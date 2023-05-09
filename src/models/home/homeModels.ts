export interface RecentStoriesInterface {
  _id: string;
  story_title: string;
  story_code: string;
  lastChapter: LastChapterInterface;
  updated_at: Date;
}

interface LastChapterInterface {
  _id: string;
  chapter_name: string;
  chapter_code: string;
  story_code: string;
}

export interface HotStoriesInterface {
  _id: string;
  story_code: string;
  story_title: string;
  story_cover: string;
}
