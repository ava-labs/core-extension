import { useWalletContext } from '@src/contexts/WalletProvider';
import { useMemo } from 'react';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { TokenWithBalance } from '@avalabs/wallet-react-components';

const bnZero = new BN(0);

export function useTokensWithBalances() {
  const { erc20Tokens, avaxPrice, antTokens, avaxToken } = useWalletContext();

  return useMemo<TokenWithBalance[]>(() => {
    return [
      avaxToken,
      ...erc20Tokens.filter((token) => token.balance.gt(bnZero)),
      ...antTokens,
    ];
  }, [erc20Tokens, avaxToken, avaxPrice, antTokens]);
}
