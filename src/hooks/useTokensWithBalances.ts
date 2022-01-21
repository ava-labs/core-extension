import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const bnZero = new BN(0);

export function useTokensWithBalances() {
  const { erc20Tokens, avaxPrice, avaxToken } = useWalletContext();
  const { showTokensWithoutBalances } = useSettingsContext();

  return useMemo<TokenWithBalance[]>(() => {
    return [
      {
        ...avaxToken,
        priceUSD: avaxPrice,
      },
      ...erc20Tokens.filter((token) =>
        showTokensWithoutBalances ? true : token.balance.gt(bnZero)
      ),
    ];
  }, [erc20Tokens, avaxToken, avaxPrice, showTokensWithoutBalances]);
}
