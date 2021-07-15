import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBalance } from '@src/hooks/useBalance';
import { useStore } from '@src/store/store';
import { usePrices } from '@src/hooks/usePrices';
import { WalletType } from '../../../avalanche-wallet-sdk-internal/dist/Wallet/types';
import { SELECTEDNETWORK } from '@src/store/network/networkStore';
import { observe } from 'mobx';

const WalletContext = createContext<{
  balances: ReturnType<typeof useBalance>;
  prices: ReturnType<typeof usePrices>;
}>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const [wallet, setWallet] = useState<WalletType | undefined>();
  const [network, setNetwork] = useState<SELECTEDNETWORK>();

  const { walletStore, networkStore } = useStore();

  observe(walletStore, 'wallet', (res) =>
    setWallet(res.newValue as WalletType)
  );
  observe(networkStore, 'network', (res) =>
    setNetwork(res.newValue as SELECTEDNETWORK)
  );

  const balances = useBalance(wallet, network);

  const prices = usePrices();

  return (
    <WalletContext.Provider value={{ balances, prices }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
