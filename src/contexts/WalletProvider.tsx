import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { filter, map } from 'rxjs';
import {
  isWalletLocked,
  WalletLockedState,
} from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { walletUpdatedEventListener } from '@src/background/services/wallet/events/walletStateUpdatesListener';
import {
  ExtensionConnectionMessageResponse,
  ExtensionRequest,
} from '@src/background/connections/models';
import { WalletState } from '@avalabs/wallet-react-components';
import { recastWalletState } from './utils/castWalletState';
import { useWalletHistory, WalletHistory } from './hooks/useWalletHIstory';
import { useSettingsContext } from './SettingsProvider';

type WalletStateAndMethods = WalletState & {
  changeWalletPassword(
    newPassword: string,
    oldPassword: string
  ): Promise<ExtensionConnectionMessageResponse<any>>;
  getUnencryptedMnemonic(
    password: string
  ): Promise<ExtensionConnectionMessageResponse<any>>;
  walletHistory?: WalletHistory;
  currencyFormatter(value: number): string;
};
const WalletContext = createContext<WalletStateAndMethods>({} as any);

function createFormatter(currency: string) {
  /**
   * For performance reasons we want to instantiate this as little as possible
   */
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
  });

  return formatter.format.bind(formatter);
}

export function WalletContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const settings = useSettingsContext();
  const [walletState, setWalletState] = useState<
    WalletState | WalletLockedState
  >();

  const walletHistory = useWalletHistory([50]);

  function setWalletStateAndCast(state: WalletState | WalletLockedState) {
    return isWalletLocked(state)
      ? setWalletState(state)
      : state &&
          (state as WalletState).balances &&
          setWalletState(recastWalletState(state as WalletState));
  }

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }

    request<WalletState>({ method: ExtensionRequest.WALLET_STATE }).then(
      setWalletStateAndCast
    );

    events()
      .pipe(
        filter(walletUpdatedEventListener),
        map((evt) => evt.value)
      )
      .subscribe(setWalletStateAndCast);
  }, []);

  function unlockWallet(password: string) {
    return request!({
      method: ExtensionRequest.WALLET_UNLOCK_STATE,
      params: [password],
    });
  }

  function changeWalletPassword(newPassword: string, oldPassword: string) {
    return request!({
      method: ExtensionRequest.WALLET_CHANGE_PASSWORD,
      params: [newPassword, oldPassword],
    });
  }

  function getUnencryptedMnemonic(password: string) {
    return request!({
      method: ExtensionRequest.WALLET_UNENCRYPTED_MNEMONIC,
      params: [password],
    });
  }

  if (!walletState) {
    return <LoadingIcon />;
  }

  if (isWalletLocked(walletState)) {
    return <WalletLocked unlockWallet={unlockWallet} />;
  }

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        changeWalletPassword,
        getUnencryptedMnemonic,
        walletHistory,
        currencyFormatter: createFormatter(settings.currency),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
