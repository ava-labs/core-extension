import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { concat, filter, map, pipe } from 'rxjs';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import {
  isWalletLocked,
  WalletLockedState,
  WalletState,
} from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { walletUpdatedEventListener } from '@src/background/services/wallet/events/walletStateUpdatesListener';

const WalletContext = createContext<WalletState>({} as any);

function recastWallletState(state: WalletState) {
  const { balanceAvaxTotal, ...values } = (state as WalletState).balances;
  return {
    ...state,
    ...{
      balances: {
        ...values,
        // have to cast back to BN since this was serialized over port connection
        balanceAvaxTotal: new BN(balanceAvaxTotal),
      },
    },
  };
}

export function WalletContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [walletState, setWalletState] = useState<
    WalletState | WalletLockedState
  >();

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }

    concat(
      request<WalletState>({ method: 'wallet_InitializeState' }),
      events().pipe(
        filter(walletUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((state: any) =>
      isWalletLocked(state)
        ? setWalletState(state)
        : state &&
          (state as WalletState).balances &&
          setWalletState(recastWallletState(state as WalletState))
    );
  }, []);

  function unlockWallet(password: string) {
    return request!({
      method: 'wallet_unlockWalletState',
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
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
