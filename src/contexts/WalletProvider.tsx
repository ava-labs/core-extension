import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { concat, filter, map } from 'rxjs';
import {
  WalletState,
  walletUpdatedEventListener,
} from '@src/background/services/wallet/handlers';
import { BN } from '@avalabs/avalanche-wallet-sdk';

const WalletContext = createContext<WalletState>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [walletState, setWalletState] = useState<WalletState>();

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
    ).subscribe((state: any) => {
      const { balanceAvaxTotal, ...values } = (state as WalletState).balances;
      setWalletState({
        ...state,
        ...{
          balances: {
            ...values,
            // have to convert back to BN since this was serialized over port connection
            balanceAvaxTotal: new BN(balanceAvaxTotal),
          },
        },
      });
    });
  }, []);

  if (!walletState) {
    return <LoadingIcon />;
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
