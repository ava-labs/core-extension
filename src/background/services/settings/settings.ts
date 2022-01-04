import { BehaviorSubject } from 'rxjs';
import { SettingsState, ThemeVariant } from './models';
import { getSettingsFromStorage } from './storage';
import {
  currentSelectedCurrency$,
  currencies,
} from '@avalabs/wallet-react-components';

export const defaultSettingsState: SettingsState = {
  currency: 'USD',
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
};

export const settings$ = new BehaviorSubject<SettingsState>(
  defaultSettingsState
);

getSettingsFromStorage().then((res) => res && settings$.next(res));

settings$.subscribe(({ currency }) => {
  const currencyObject = currencies.find(({ symbol }) => currency === symbol);
  if (currencyObject) currentSelectedCurrency$.next(currencyObject.symbol);
});
