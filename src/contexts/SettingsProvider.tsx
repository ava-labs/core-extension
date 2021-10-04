import {
  ExtensionConnectionMessageResponse,
  ExtensionRequest,
} from '@src/background/connections/models';
import { settingsUpdatedEventListener } from '@src/background/services/settings/events/listeners';
import { SettingsState } from '@src/background/services/settings/models';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
};

const SettingsContext = createContext<SettingsFromProvider>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [settings, setSettings] = useState<SettingsState>();

  useEffect(() => {
    if (!events) {
      return;
    }

    request({
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
  }, []);

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

  return (
    <SettingsContext.Provider
      value={
        {
          ...settings,
          lockWallet,
          updateCurrencySetting,
          toggleShowTokensWithoutBalanceSetting,
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
