import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import type {
  GetSettingsHandler,
  LockWalletHandler,
  SetAnalyticsConsentHandler,
  SetCoreAssistantHandler,
  SetLanguageHandler,
  UpdateCollectiblesVisibilityHandler,
  UpdateCurrencyHandler,
  UpdateShowNoBalanceHandler,
  UpdateThemeHandler,
  UpdateTokensVisiblityHandler,
} from '@core/service-worker';
import {
  ExtensionRequest,
  Languages,
  SettingsState,
  ThemeVariant,
} from '@core/types';
import { isTokenMalicious, updateIfDifferent } from '@core/common';
import { changeLanguage } from 'i18next';
import { omit, set } from 'lodash';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from '../ConnectionProvider';
import { getCurrencyFormatter } from '../utils/getCurrencyFormatter';
import { isSettingsUpdatedEvent } from './isSettingsUpdatedEvent';
import { SettingsPages } from './models';

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
  setCoreAssistant: (state: boolean) => Promise<boolean>;
  nextGenTheme: 'system' | 'testnet' | 'dark' | 'light';
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
        filter(isSettingsUpdatedEvent),
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
    if (token.type !== TokenType.ERC20 && token.type !== TokenType.SPL) {
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
      const key =
        token.type === TokenType.NATIVE ? token.symbol : token.address;
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

  function setCoreAssistant(state: boolean) {
    return request<SetCoreAssistantHandler>({
      method: ExtensionRequest.SETTINGS_SET_CORE_ASSISTANT,
      params: [state],
    });
  }

  return (
    <SettingsContext.Provider
      value={
        {
          ...settings,
          nextGenTheme: 'system', // TODO: fix this
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
          setCoreAssistant,
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
