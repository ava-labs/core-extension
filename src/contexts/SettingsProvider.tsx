import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { LockWalletHandler } from '@src/background/services/lock/handlers/lockWallet';
import { settingsUpdatedEventListener } from '@src/background/services/settings/events/listeners';
import { GetSettingsHandler } from '@src/background/services/settings/handlers/getSettings';
import { SetAnalyticsConsentHandler } from '@src/background/services/settings/handlers/setAnalyticsConsent';
import { SetLanguageHandler } from '@src/background/services/settings/handlers/setLanguage';
import { UpdateCurrencyHandler } from '@src/background/services/settings/handlers/updateCurrencySelection';
import { UpdateShowNoBalanceHandler } from '@src/background/services/settings/handlers/updateShowTokensNoBalance';
import { UpdateThemeHandler } from '@src/background/services/settings/handlers/updateTheme';
import { UpdateTokensVisiblityHandler } from '@src/background/services/settings/handlers/updateTokensVisibility';
import {
  Languages,
  SettingsState,
  ThemeVariant,
} from '@src/background/services/settings/models';
import { SettingsPages } from '@src/components/settings/models';
import { changeLanguage } from 'i18next';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from './ConnectionProvider';
import { getCurrencyFormatter } from './utils/getCurrencyFormatter';

type SettingsFromProvider = SettingsState & {
  lockWallet(): Promise<true>;
  updateCurrencySetting(currency: string): Promise<true>;
  toggleShowTokensWithoutBalanceSetting(): Promise<true>;
  toggleTokenVisibility(token: TokenWithBalance): Promise<true | undefined>;
  getTokenVisibility(token: TokenWithBalance): boolean;
  updateTheme(theme: ThemeVariant): Promise<boolean>;
  currencyFormatter(value: number): string;
  setAnalyticsConsent(consent: boolean): Promise<boolean>;
  setLanguage(lang: Languages): Promise<boolean>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => Dispatch<SetStateAction<boolean>>;
  settingsActivePage: SettingsPages;
  setSettingsActivePage: (
    activePage: SettingsPages
  ) => Dispatch<SetStateAction<SettingsPages>>;
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [settings, setSettings] = useState<SettingsState>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsActivePage, setSettingsActivePage] = useState<SettingsPages>(
    SettingsPages.MAIN_PAGE
  );

  useEffect(() => {
    changeLanguage(settings?.language);
  }, [settings?.language]);

  useEffect(() => {
    request<GetSettingsHandler>({
      method: ExtensionRequest.SETTINGS_GET,
    }).then((res) => {
      setSettings(res);
    });

    const subscription = events()
      .pipe(
        filter(settingsUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe((val) => setSettings(val));

    return () => subscription.unsubscribe();
  }, [events, request]);

  const currencyFormatter = useMemo(
    () => getCurrencyFormatter(settings?.currency ?? 'USD'),
    [settings?.currency]
  );

  function lockWallet() {
    setIsSettingsOpen(false);
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

  function setAnalyticsConsent(consent: boolean) {
    return request<SetAnalyticsConsentHandler>({
      method: ExtensionRequest.SETTINGS_SET_ANALYTICS_CONSENT,
      params: [consent],
    });
  }

  function setLanguage(lang: Languages) {
    return request<SetLanguageHandler>({
      method: ExtensionRequest.SETTINGS_SET_LANGUAGE,
      params: [lang],
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
          setAnalyticsConsent,
          setLanguage,
          isSettingsOpen,
          setIsSettingsOpen,
          settingsActivePage,
          setSettingsActivePage,
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
