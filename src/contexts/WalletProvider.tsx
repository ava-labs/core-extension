import React, { createContext, useContext, useState } from 'react';
import { useBalance } from '@src/hooks/useBalance';
import { usePrices } from '@src/hooks/usePrices';
import { useGetErc20Tokens } from '@src/hooks/useGetErc20Tokens';
import { useAddresses } from '@src/hooks/useAddresses';
import { WalletType } from '../../../avalanche-wallet-sdk-internal/dist/Wallet/types';
import { useNetworkContext } from './NetworkProvider';
import { walletService } from '@src/background/services';
import { useEffect } from 'react';

const WalletContext = createContext<{
  wallet?: WalletType;
  balances: ReturnType<typeof useBalance>;
  prices: ReturnType<typeof usePrices>;
  tokens: ReturnType<typeof useGetErc20Tokens>;
  addresses: ReturnType<typeof useAddresses>;
}>({} as any);

export function WalletContextProvider({ children }: { children: any }) {
  const [wallet, setWallet] = useState<WalletType | undefined>();
  const { network } = useNetworkContext();

  // listen for wallet creation
  useEffect(() => {
    walletService.wallet.add((wall) => setWallet(wall));
  }, []);

  const balances = useBalance(wallet, network);
  const prices = usePrices();
  const tokens = useGetErc20Tokens(wallet, network);
  const addresses = useAddresses(wallet, network);

  return (
    <WalletContext.Provider
      value={{ balances, prices, tokens, wallet, addresses }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
