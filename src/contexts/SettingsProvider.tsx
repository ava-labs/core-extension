import { ExtensionConnectionMessageResponse } from '@src/background/connections/models';
import React, { createContext, useContext } from 'react';
import { useConnectionContext } from './ConnectionProvider';

const SettingsContext = createContext<{
  lockWallet(): Promise<ExtensionConnectionMessageResponse<any>>;
}>({} as any);

export function SettingsContextProvider({ children }: { children: any }) {
  const { request } = useConnectionContext();

  function lockWallet() {
    return request!({ method: 'settings_lockWallet' });
  }

  return (
    <SettingsContext.Provider value={{ lockWallet }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
