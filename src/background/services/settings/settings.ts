import { BehaviorSubject, combineLatest, filter, switchMap } from 'rxjs';
import { SettingsState, ThemeVariant } from './models';
import { getSettingsFromStorage } from './storage';
import {
  currentSelectedCurrency$,
  currencies,
  customErc20Tokens$,
  network$,
} from '@avalabs/wallet-react-components';
import { storageKey$ } from '../wallet/storageKey';

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

storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getSettingsFromStorage())
  )
  .subscribe((res) => {
    const updateSettings = {
      ...defaultSettingsState,
      ...res,
    };
    settings$.next(updateSettings);
  });

settings$.subscribe(({ currency }) => {
  const currencyObject = currencies.find(({ symbol }) => currency === symbol);
  if (currencyObject) currentSelectedCurrency$.next(currencyObject.symbol);
});

combineLatest([settings$, network$]).subscribe(([settings, network]) => {
  if (!network?.chainId || !settings.customTokens) return;
  customErc20Tokens$.next(settings.customTokens[network.chainId]);
});
