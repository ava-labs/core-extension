import { BehaviorSubject, combineLatest } from 'rxjs';
import { SettingsState, ThemeVariant } from './models';
import { getSettingsFromStorage } from './storage';
import {
  currentSelectedCurrency$,
  currencies,
  customErc20Tokens$,
  network$,
} from '@avalabs/wallet-react-components';

export const defaultSettingsState: SettingsState = {
  currency: 'USD',
  customTokens: {},
  showTokensWithoutBalances: false,
  theme: ThemeVariant.DARK,
  tokensVisibility: {},
  isDefaultExtension: false,
};

export const settings$ = new BehaviorSubject<SettingsState>(
  defaultSettingsState
);

getSettingsFromStorage().then((res) => res && settings$.next(res));

settings$.subscribe(({ currency }) => {
  const currencyObject = currencies.find(({ symbol }) => currency === symbol);
  if (currencyObject) currentSelectedCurrency$.next(currencyObject.symbol);
});

combineLatest([settings$, network$]).subscribe(([settings, network]) => {
  if (!network?.chainId || !settings.customTokens) return;
  customErc20Tokens$.next(settings.customTokens[network.chainId]);
});
