import { useThemeContext } from '@avalabs/react-components';
import {
  ExtensionConnectionMessageResponse,
  ExtensionRequest,
} from '@src/background/connections/models';
import { settingsUpdatedEventListener } from '@src/background/services/settings/events/listeners';
import {
  SettingsState,
  ThemeVariant,
} from '@src/background/services/settings/models';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  updateTheme(theme: ThemeVariant): Promise<boolean>;
  currencyFormatter(value: number): string;
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { darkMode, toggleDarkTheme } = useThemeContext();
  const [settings, setSettings] = useState<SettingsState>();

  useEffect(() => {
    if (!events) {
      return;
    }

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
  }, []);

  const currencyFormatter = useMemo(() => {
    /**
     * For performance reasons we want to instantiate this as little as possible
     */
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings?.currency ?? 'USD',
    });
    console.log('made it to currency: ', settings?.currency ?? 'USD');
    return formatter.format.bind(formatter);
  }, [settings?.currency]);

  function lockWallet() {
    return request!({ method: ExtensionRequest.SETTINGS_LOCK_WALLET });
  }

  function updateCurrencySetting(currency: string) {
    return request!({
      method: ExtensionRequest.SETTINGS_UPDATE_CURRENCY,
      params: [currency],
    });
  }

  function toggleShowTokensWithoutBalanceSetting() {
    return request!({
      method: ExtensionRequest.SETTINGS_UPDATE_SHOW_NO_BALANCE,
      params: [!settings?.showTokensWithoutBalances],
    });
  }

  function updateTheme(theme: ThemeVariant) {
    return request!({
      method: ExtensionRequest.SETTINGS_UPDATE_THEME,
      params: [theme],
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
          updateTheme,
          currencyFormatter,
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
