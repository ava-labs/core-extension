import { ExtensionRequest } from '@core/service-worker';
import { LockWalletHandler } from '@core/service-worker';
import { settingsUpdatedEventListener } from '@core/service-worker';
import { GetSettingsHandler } from '@core/service-worker';
import { SetAnalyticsConsentHandler } from '@core/service-worker';
import { SetLanguageHandler } from '@core/service-worker';
import { UpdateCurrencyHandler } from '@core/service-worker';
import { UpdateShowNoBalanceHandler } from '@core/service-worker';
import { UpdateThemeHandler } from '@core/service-worker';
import { UpdateTokensVisiblityHandler } from '@core/service-worker';
import { UpdateCollectiblesVisibilityHandler } from '@core/service-worker';
import {
  Languages,
  SettingsState,
  ThemeVariant,
} from '@core/service-worker';
import { SettingsPages } from 'packages/ui/src/components/settings/models';
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
import { omit, set } from 'lodash';
import { useConnectionContext } from './ConnectionProvider';
import { getCurrencyFormatter } from './utils/getCurrencyFormatter';
import { updateIfDifferent } from '@core/utils';
import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { isTokenMalicious } from '@core/utils';

type SettingsFromProvider = SettingsState & {
  lockWallet(): Promise<true>;
  updateCurrencySetting(currency: string): Promise<true>;
  toggleShowTokensWithoutBalanceSetting(): Promise<true>;
  toggleTokenVisibility(token: TokenWithBalance): Promise<true | undefined>;
  getTokenVisibility(token: TokenWithBalance): boolean;
  toggleCollectibleVisibility(
    token: NftTokenWithBalance,
  ): Promise<true | undefined>;
  getCollectibleVisibility(token: NftTokenWithBalance): boolean;
  updateTheme(theme: ThemeVariant): Promise<boolean>;
  currencyFormatter(value: number): string;
  setAnalyticsConsent(consent: boolean): Promise<boolean>;
  setLanguage(lang: Languages): Promise<boolean>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => Dispatch<SetStateAction<boolean>>;
  settingsActivePage: SettingsPages;
  setSettingsActivePage: (
    activePage: SettingsPages,
  ) => Dispatch<SetStateAction<SettingsPages>>;
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [settings, setSettings] = useState<SettingsState>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsActivePage, setSettingsActivePage] = useState<SettingsPages>(
    SettingsPages.MAIN_PAGE,
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
        map((evt) => evt.value),
      )
      .subscribe((newSettings) => {
        updateIfDifferent(setSettings, newSettings);
      });

    return () => subscription.unsubscribe();
  }, [events, request]);

  const currencyFormatter = useMemo(
    () => getCurrencyFormatter(settings?.currency ?? 'USD'),
    [settings?.currency],
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
          [key]: !getTokenVisibility(token),
        },
      ],
    });
  }

  const getTokenVisibility = useCallback(
    (token: TokenWithBalance) => {
      const key = token.type === TokenType.ERC20 ? token.address : token.symbol;
      const tokensVisibility = settings?.tokensVisibility ?? {};

      // If the token is flagged as malicious, only show it if the user specifcially enabled it.
      return isTokenMalicious(token)
        ? tokensVisibility[key]
        : tokensVisibility[key] || tokensVisibility[key] === undefined;
    },
    [settings?.tokensVisibility],
  );

  async function toggleCollectibleVisibility(nft: NftTokenWithBalance) {
    const key = `${nft.address}-${nft.tokenId}`;
    const visibility = settings?.collectiblesVisibility ?? {};
    // We used to (wrongly) index by address only.
    const isHidden = (visibility[key] ?? visibility[nft.address]) === false;
    // If token is now hidde, just remove it from the dictionary,
    // otherwise set it to false.
    const updatedVisibility = isHidden
      ? omit(visibility, [nft.address, key])
      : set(visibility, key, false);

    return request<UpdateCollectiblesVisibilityHandler>({
      method: ExtensionRequest.SETTINGS_UPDATE_COLLECTIBLES_VISIBILITY,
      params: [updatedVisibility],
    });
  }

  const getCollectibleVisibility = useCallback(
    (nft: NftTokenWithBalance) => {
      const key = `${nft.address}-${nft.tokenId}`;
      const visibility = settings?.collectiblesVisibility ?? {};
      // We used to index by address only.
      return (visibility[key] ?? visibility[nft.address]) !== false;
    },
    [settings?.collectiblesVisibility],
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
          getCollectibleVisibility,
          toggleCollectibleVisibility,
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
