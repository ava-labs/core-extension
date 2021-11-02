import React, { createContext, useContext, useMemo, useState } from 'react';
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
import { ExtensionRequest } from '@src/background/connections/models';
import { WalletState } from '@avalabs/wallet-react-components';
import { recastWalletState } from './utils/castWalletState';
import { useSettingsContext } from './SettingsProvider';
import { chunkHistoryByDate } from './utils/chunkWalletHistory';

type WalletStateAndMethods = WalletState & {
  changeWalletPassword(
    newPassword: string,
    oldPassword: string
  ): Promise<boolean>;
  getUnencryptedMnemonic(password: string): Promise<string>;
  chunkedHistoryByDate: ReturnType<typeof chunkHistoryByDate>;
};
const WalletContext = createContext<WalletStateAndMethods>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const { currency } = useSettingsContext();
  const [walletState, setWalletState] = useState<
    WalletState | WalletLockedState
  >();

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

  const chunkedHistoryByDate = useMemo(() => {
    return chunkHistoryByDate(
      (walletState as WalletState)?.recentTxHistory || []
    );
  }, [
    (walletState as WalletState)?.recentTxHistory?.length,
    /**
     * Watching hours, when the hour changes we rechunk and show new dates
     * this is an edge case we shouldnt run into often
     */
    new Date().getHours(),
  ]);

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
        chunkedHistoryByDate,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
