import { BehaviorSubject, filter, mergeMap } from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';
import { AnalyticsState } from './models';
import {
  cacheAnalyticsIds,
  getAnalyticsStateFromStorage,
  getCachedAnalyticsIds,
} from './storage';

export const analyticsState$ = new BehaviorSubject<AnalyticsState | undefined>(
  undefined
);

// reset analytics IDs from session storage after the background script restart
// this is especially important for onboarding since we don't have the ids in
// persistent storage yet
getCachedAnalyticsIds().then((state) => {
  if (state) {
    analyticsState$.next(state);
  }
});
analyticsState$.subscribe((state) => {
  cacheAnalyticsIds(state);
});

// load analytics keys from the storage as soon as we have the encryption key
// this will notify the frontend script and kick in the analytics
storageKey$
  .pipe(
    filter((ready) => !!ready),
    mergeMap(() => getAnalyticsStateFromStorage())
  )
  .subscribe((res) => {
    return res && analyticsState$.next(res);
  });
