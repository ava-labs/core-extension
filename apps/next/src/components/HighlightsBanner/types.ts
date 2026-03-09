import { ReactNode } from 'react';

export type HighlightBannerAction =
  | { type: 'internal'; path: string }
  | { type: 'external'; url: string };

export type HighlightBannerConfig = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  action: HighlightBannerAction;
};
