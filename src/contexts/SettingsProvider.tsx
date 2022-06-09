import { useThemeContext } from '@avalabs/react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionConnectionMessageResponse } from '@src/background/connections/models';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { settingsUpdatedEventListener } from '@src/background/services/settings/events/listeners';
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
  lockWallet(): Promise<ExtensionConnectionMessageResponse<any>>;
  updateCurrencySetting(
    currency: string
  ): Promise<ExtensionConnectionMessageResponse<any>>;
  toggleShowTokensWithoutBalanceSetting(): Promise<
    ExtensionConnectionMessageResponse<any>
  >;
  toggleTokenVisibility(
    token: TokenWithBalance
  ): Promise<ExtensionConnectionMessageResponse<any>>;
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
    request({
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
    });

    return formatter.format.bind(formatter);
  }, [settings?.currency]);

  function lockWallet() {
    return request({ method: ExtensionRequest.LOCK_WALLET });
  }

  function updateCurrencySetting(currency: string) {
    return request({
      method: ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
      params: [currency],
    });
  }

  function toggleShowTokensWithoutBalanceSetting() {
    return request({
      method: ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE,
      params: [!settings?.showTokensWithoutBalances],
    });
  }

  function toggleTokenVisibility(token: TokenWithBalance) {
    if (token.type !== TokenType.ERC20) {
      return;
    }

    const key = token.address;
    const tokensVisibility = settings?.tokensVisibility ?? {};
    return request({
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
      if (token.type !== TokenType.ERC20) {
        return false;
      }

      const key = token.address;
      const tokensVisibility = settings?.tokensVisibility ?? {};
      return tokensVisibility[key] || tokensVisibility[key] === undefined;
    },
    [settings?.tokensVisibility]
  );

  function updateTheme(theme: ThemeVariant) {
    return request({
      method: ExtensionRequest.SETTINGS_UPDATE_THEME,
      params: [theme],
    });
  }

  /**
   *
   * @returns boolean state of isDefaultExtenion in settings state
   */
  function toggleIsDefaultExtension() {
    return request({
      method: ExtensionRequest.SETTINGS_SET_DEFAULT_EXTENSION,
      params: [],
    });
  }

  function setAnalyticsConsent(consent: boolean) {
    return request({
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
