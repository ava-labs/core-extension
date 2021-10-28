import { BehaviorSubject } from 'rxjs';
import { SettingsState, ThemeVariant } from './models';
import { getSettingsFromStorage } from './storage';

export const defaultSettingsState: SettingsState = {
  currency: 'USD',
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
};

export const settings$ = new BehaviorSubject<SettingsState>(
  defaultSettingsState
);

getSettingsFromStorage().then((res) => res && settings$.next(res));
