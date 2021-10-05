import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { TokenWithBalance } from '@avalabs/wallet-react-components';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

const bnZero = new BN(0);

export function useTokensWithBalances() {
  const { erc20Tokens, avaxPrice, antTokens, avaxToken } = useWalletContext();
  const { showTokensWithoutBalances } = useSettingsContext();

  return useMemo<TokenWithBalance[]>(() => {
    return [
      avaxToken,
      ...erc20Tokens.filter((token) =>
        showTokensWithoutBalances ? true : token.balance.gt(bnZero)
      ),
      ...antTokens,
    ];
  }, [erc20Tokens, avaxToken, avaxPrice, antTokens, showTokensWithoutBalances]);
}
