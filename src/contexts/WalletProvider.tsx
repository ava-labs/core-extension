import React, { createContext, useContext, useState } from 'react';
import { useBalance } from '@src/hooks/useBalance';
import { useStore } from '@src/store/store';
import { usePrices } from '@src/hooks/usePrices';
import { useGetErc20Tokens } from '@src/hooks/useGetErc20Tokens';
import { WalletType } from '../../../avalanche-wallet-sdk-internal/dist/Wallet/types';
import { SELECTEDNETWORK } from '@src/store/network/networkStore';
import { observe } from 'mobx';

const WalletContext = createContext<{
  wallet?: WalletType;
  balances: ReturnType<typeof useBalance>;
  prices: ReturnType<typeof usePrices>;
  tokens: ReturnType<typeof useGetErc20Tokens>;
}>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const { walletStore, networkStore } = useStore();
  const [wallet, setWallet] = useState<WalletType | undefined>();
  const [network, setNetwork] = useState<SELECTEDNETWORK>(networkStore.network);

  observe(walletStore, 'wallet', (res) =>
    setWallet(res.newValue as WalletType)
  );
  observe(networkStore, 'network', (res) => {
    setNetwork(res.newValue as SELECTEDNETWORK);
  });

  const balances = useBalance(wallet, network);
  const prices = usePrices();
  const tokens = useGetErc20Tokens(wallet, network);
  console.log('tokens: ', tokens, network);
  return (
    <WalletContext.Provider value={{ balances, prices, tokens, wallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
