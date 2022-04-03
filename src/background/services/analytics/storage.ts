import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '@src/utils/storage/chrome-storage';
import {
  getFromSessionStorage,
  saveToSessionStorage,
} from '@src/utils/storage/session-storage';
import { AnalyticsState } from './models';

const ANALYTICS_STORAGE_KEY = 'ANALYTICS_STORAGE_KEY';

export const saveAnalyticsStateToStorage = (contacts: AnalyticsState) =>
  saveToStorage(ANALYTICS_STORAGE_KEY, contacts);

export const getAnalyticsStateFromStorage = () =>
  getFromStorage<AnalyticsState>(ANALYTICS_STORAGE_KEY);

export const clearAnalyticsStateFromStorage = () =>
  removeFromStorage(ANALYTICS_STORAGE_KEY);

export const cacheAnalyticsIds = (state: AnalyticsState | undefined) =>
  saveToSessionStorage(ANALYTICS_STORAGE_KEY, state);

export const getCachedAnalyticsIds = () =>
  getFromSessionStorage<AnalyticsState>(ANALYTICS_STORAGE_KEY);
