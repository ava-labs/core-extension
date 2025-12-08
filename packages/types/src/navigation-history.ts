import * as H from 'history';

export interface NavigationHistoryDataState {
  [key: string]: unknown;
}

export type NavigationHistoryState = H.History<unknown> | Record<string, never>;

export interface NavigationHistoryStorage {
  state: NavigationHistoryState;
  data: NavigationHistoryDataState;
}

export const NAVIGATION_HISTORY_STORAGE_KEY = 'NAVIGATION_HISTORY';

export enum NavigationHistoryEvents {
  NAVIGATION_HISTORY_REQUEST_NAVIGATION_EVENT = 'NAVIGATION_HISTORY_REQUEST_NAVIGATION_EVENT',
}
