import {
  NftTokenWithBalance,
  TokenType,
  TokenWithBalance,
} from '@avalabs/vm-module-types';
import { isTokenMalicious, updateIfDifferent } from '@core/common';
import type {
  GetSettingsHandler,
  LockWalletHandler,
  SetAnalyticsConsentHandler,
  SetCoreAssistantHandler,
  SetLanguageHandler,
  SetPreferredViewHandler,
  SetPrivacyModeHandler,
  SetShowTrendingTokensHandler,
  UpdateCollectiblesVisibilityHandler,
  UpdateCurrencyHandler,
  UpdateShowNoBalanceHandler,
  UpdateThemeHandler,
  UpdateTokensVisiblityHandler,
} from '@core/service-worker';
import {
  ColorTheme,
  ExtensionRequest,
  Languages,
  SettingsState,
  ViewMode,
} from '@core/types';
import { changeLanguage } from 'i18next';
import { omit, set } from 'lodash';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { filter, map } from 'rxjs';
import { useConnectionContext } from '../ConnectionProvider';
import {
  getCurrencyFormatter,
  getObfuscatedCurrency,
} from '../utils/getCurrencyFormatter';
import { isSettingsUpdatedEvent } from './isSettingsUpdatedEvent';
import { SettingsPages } from './models';

type SettingsFromProvider = SettingsState & {
  lockWallet(): Promise<true>;
  updateCurrencySetting(currency: string): Promise<true>;
  toggleShowTokensWithoutBalanceSetting(): Promise<true>;
  toggleTokenVisibility(
    token: TokenWithBalance,
    caipId: string,
  ): Promise<true | undefined>;
  getTokenVisibility(token: TokenWithBalance, caipId?: string): boolean;
  toggleCollectibleVisibility(
    token: NftTokenWithBalance,
    caipId: string,
  ): Promise<true | undefined>;
  getCollectibleVisibility(
    token: NftTokenWithBalance,
    caipId?: string,
  ): boolean;
  updateTheme(theme: ColorTheme): Promise<boolean>;
  currencyFormatter(value: number, withRounding?: boolean): string;
  setAnalyticsConsent(consent: boolean): Promise<boolean>;
  setLanguage(lang: Languages): Promise<boolean>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => Dispatch<SetStateAction<boolean>>;
  settingsActivePage: SettingsPages;
  setSettingsActivePage: (
    activePage: SettingsPages,
  ) => Dispatch<SetStateAction<SettingsPages>>;
  setCoreAssistant: (state: boolean) => Promise<boolean>;
  setPreferredView: (viewMode: ViewMode) => Promise<boolean>;
  setShowTrendingTokens: (show: boolean) => Promise<boolean>;
  setPrivacyMode: (enabled: boolean) => Promise<boolean>;
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: PropsWithChildren) {
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

  const currencyFormatter = useMemo(() => {
    const currency = settings?.currency ?? 'USD';

    if (settings?.privacyMode) {
      const obfuscated = getObfuscatedCurrency(currency);
      return () => obfuscated;
    }

    return getCurrencyFormatter(currency);
  }, [settings?.currency, settings?.privacyMode]);

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

  async function toggleTokenVisibility(
    token: TokenWithBalance,
    caipId: string,
  ) {
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
          [caipId]: {
            ...(tokensVisibility[caipId] ?? {}),
            [key]: !getTokenVisibility(token, caipId),
          },
        },
      ],
    });
  }

  const getTokenVisibility = useCallback(
    (token: TokenWithBalance, caipId?: string) => {
      if (!caipId) {
        return true;
      }
      const key =
        token.type === TokenType.NATIVE ? token.symbol : token.address;
      const tokenVisibility = settings?.tokensVisibility?.[caipId]?.[key];

      // If the token is flagged as malicious, only show it if the user specifically enabled it.
      return isTokenMalicious(token)
        ? tokenVisibility
        : tokenVisibility || tokenVisibility === undefined;
    },
    [settings?.tokensVisibility],
  );

  async function toggleCollectibleVisibility(
    nft: NftTokenWithBalance,
    caipId: string,
  ) {
    const key = `${nft.address}-${nft.tokenId}`;
    const visibility = settings?.collectiblesVisibility ?? {};
    // We used to (wrongly) index by address only.
    const isHidden =
      (visibility[caipId]?.[key] ?? visibility[caipId]?.[nft.address]) ===
      false;
    // If token is now hidden, just remove it from the dictionary,
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
    (nft: NftTokenWithBalance, caipId?: string) => {
      if (!caipId) {
        return true;
      }
      const key = `${nft.address}-${nft.tokenId}`;
      const visibility = settings?.collectiblesVisibility ?? {};
      // We used to index by address only.
      return (
        (visibility[caipId]?.[key] ?? visibility[caipId]?.[nft.address]) !==
        false
      );
    },
    [settings?.collectiblesVisibility],
  );

  function updateTheme(theme: ColorTheme) {
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

  const setPreferredView = useCallback(
    (viewMode: ViewMode) => {
      return request<SetPreferredViewHandler>({
        method: ExtensionRequest.SETTINGS_SET_PREFERRED_VIEW,
        params: [viewMode],
      });
    },
    [request],
  );

  const setShowTrendingTokens = useCallback(
    (show: boolean) => {
      return request<SetShowTrendingTokensHandler>({
        method: ExtensionRequest.SETTINGS_SET_SHOW_TRENDING_TOKENS,
        params: [show],
      });
    },
    [request],
  );

  const setPrivacyMode = useCallback(
    (enabled: boolean) => {
      return request<SetPrivacyModeHandler>({
        method: ExtensionRequest.SETTINGS_SET_PRIVACY_MODE,
        params: [enabled],
      });
    },
    [request],
  );

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
          setCoreAssistant,
          setPreferredView,
          setShowTrendingTokens,
          setPrivacyMode,
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
