import { BehaviorSubject } from 'rxjs';
import { SettingsState } from './models';
import { getSettingsFromStorage } from './storage';

export const defaultSettingsState: SettingsState = {
  currency: 'USD',
  showTokensWithoutBalances: false,
};

export const settings$ = new BehaviorSubject<SettingsState>(
  defaultSettingsState
);

getSettingsFromStorage().then((res) => res && settings$.next(res));
