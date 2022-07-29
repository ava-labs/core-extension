import { useThemeContext } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { LockWalletHandler } from '@src/background/services/lock/handlers/lockWallet';
import { settingsUpdatedEventListener } from '@src/background/services/settings/events/listeners';
import { GetSettingsHandler } from '@src/background/services/settings/handlers/getSettings';
import { SetAnalyticsConsentHandler } from '@src/background/services/settings/handlers/setAnalyticsConsent';
import { SetDefaultExtensionHandler } from '@src/background/services/settings/handlers/setAsDefaultExtension';
import { UpdateCurrencyHandler } from '@src/background/services/settings/handlers/updateCurrencySelection';
import { UpdateShowNoBalanceHandler } from '@src/background/services/settings/handlers/updateShowTokensNoBalance';
import { UpdateThemeHandler } from '@src/background/services/settings/handlers/updateTheme';
import { UpdateTokensVisiblityHandler } from '@src/background/services/settings/handlers/updateTokensVisibility';
import {
  SettingsState,
  ThemeVariant,
} from '@src/background/services/settings/models';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';

type SettingsFromProvider = SettingsState & {
  lockWallet(): Promise<true>;
  updateCurrencySetting(currency: string): Promise<true>;
  toggleShowTokensWithoutBalanceSetting(): Promise<true>;
  toggleTokenVisibility(token: TokenWithBalance): Promise<true | undefined>;
  getTokenVisibility(token: TokenWithBalance): boolean;
  updateTheme(theme: ThemeVariant): Promise<boolean>;
  currencyFormatter(value: number): string;
  toggleIsDefaultExtension(): Promise<boolean>;
  setAnalyticsConsent(consent: boolean): Promise<boolean>;
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { darkMode, toggleDarkTheme } = useThemeContext();
  const [settings, setSettings] = useState<SettingsState>();

  useEffect(() => {
    request<GetSettingsHandler>({
      method: ExtensionRequest.SETTINGS_GET,
    }).then((res) => {
      setSettings(res);

      // set theme to the saved value
      if (
        (darkMode && res.theme === ThemeVariant.LIGHT) ||
        (!darkMode && res.theme === ThemeVariant.DARK)
      ) {
        toggleDarkTheme();
      }
    });

    const subscription = events()
      .pipe(
        filter(settingsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setSettings(val));

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currencyFormatter = useMemo(() => {
    /**
     * For performance reasons we want to instantiate this as little as possible
     */
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings?.currency ?? 'USD',
      currencyDisplay: 'narrowSymbol',
    });

    return (amount: number) => {
      const parts = formatter.formatToParts(amount);
      /**
       *  This formats the currency to return
       *  <symbol><amount>
       *  ex. $10.00, €10.00
       * if the (ie. CHF) matches the the it returns
       * <amount><symbol>
       * ex. 10 CHF
       */

      if (parts[0]?.value === settings?.currency) {
        const flatArray = parts.map((x) => x.value);
        flatArray.push(` ${flatArray.shift() || ''}`);
        return flatArray.join('').trim();
      }

      return formatter.format(amount);
    };
  }, [settings?.currency]);

  function lockWallet() {
    return request<LockWalletHandler>({ method: ExtensionRequest.LOCK_WALLET });
  }

  function updateCurrencySetting(currency: string) {
    return request<UpdateCurrencyHandler>({
      method: ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
      params: [currency],
    });
  }

  function toggleShowTokensWithoutBalanceSetting() {
    return request<UpdateShowNoBalanceHandler>({
      method: ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE,
      params: [!settings?.showTokensWithoutBalances],
    });
  }

  async function toggleTokenVisibility(token: TokenWithBalance) {
    if (token.type !== TokenType.ERC20) {
      return;
    }

    const key = token.address;
    const tokensVisibility = settings?.tokensVisibility ?? {};
    return request<UpdateTokensVisiblityHandler>({
      method: ExtensionRequest.SETTINGS_UPDATE_TOKENS_VISIBILITY,
      params: [
        {
          ...tokensVisibility,
          [key]:
            tokensVisibility[key] !== undefined
              ? !tokensVisibility[key]
              : false,
        },
      ],
    });
  }

  const getTokenVisibility = useCallback(
    (token: TokenWithBalance) => {
      const key = token.type === TokenType.ERC20 ? token.address : token.symbol;
      const tokensVisibility = settings?.tokensVisibility ?? {};
      return tokensVisibility[key] || tokensVisibility[key] === undefined;
    },
    [settings?.tokensVisibility]
  );

  function updateTheme(theme: ThemeVariant) {
    return request<UpdateThemeHandler>({
      method: ExtensionRequest.SETTINGS_UPDATE_THEME,
      params: [theme],
    });
  }

  /**
   *
   * @returns boolean state of isDefaultExtenion in settings state
   */
  function toggleIsDefaultExtension() {
    return request<SetDefaultExtensionHandler>({
      method: ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION,
    });
  }

  function setAnalyticsConsent(consent: boolean) {
    return request<SetAnalyticsConsentHandler>({
      method: ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT,
      params: [consent],
    });
  }

  return (
    <SettingsContext.Provider
      value={
        {
          ...settings,
          lockWallet,
          updateCurrencySetting,
          toggleShowTokensWithoutBalanceSetting,
          getTokenVisibility,
          toggleTokenVisibility,
          updateTheme,
          currencyFormatter,
          toggleIsDefaultExtension,
          setAnalyticsConsent,
        } as SettingsFromProvider
      }
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
