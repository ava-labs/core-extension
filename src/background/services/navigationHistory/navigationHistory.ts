import { BehaviorSubject } from 'rxjs';
import * as H from 'history';
interface NavigationHistoryDataState {
  [key: string]: Record<string, unknown>;
}

export type NavigationHistoryState = H.History<unknown> | Record<string, never>;

export const defaultNavigationHistoryDataState: NavigationHistoryDataState = {};
export const defaultNavigationHistoryState: NavigationHistoryState = {};

export const navigationHistoryData$ =
  new BehaviorSubject<NavigationHistoryDataState>(
    defaultNavigationHistoryDataState
  );

export const navigationHistory$ = new BehaviorSubject<NavigationHistoryState>(
  defaultNavigationHistoryState
);

export const excludedPathNames = ['/send/confirm', '/collectible/send/confirm'];
export const reservedData = ['listType'];
