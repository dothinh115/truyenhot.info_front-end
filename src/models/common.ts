import { EmotionCache } from "@emotion/cache";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout = NextPage & {
  Layout?: (props: any) => ReactElement;
};

export type MyAppProps = AppProps & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

export interface MainLayoutInterface {
  children: ReactNode;
}

export interface LoginLayoutInterface {
  children: ReactNode;
}

export interface AdminLayoutInterface {
  children: ReactNode;
}

export type LoginType = {
  email: string;
  password: string;
};

export interface NewStoryInterface {
  story_title: string;
  story_description: string;
  story_author: string;
  story_source: string;
  story_category: string;
  cover_img?: any;
}

export interface SectionInterface {
  children: ReactNode;
}

export interface BlockInterface {
  children: ReactNode;
}
