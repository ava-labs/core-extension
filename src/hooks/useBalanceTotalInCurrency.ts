import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useBalanceTotalInCurrency() {
  const { avaxToken } = useWalletContext();
  const tokensWBalances = useTokensWithBalances();

  return (
    (avaxToken?.balanceUSD || 0) +
    tokensWBalances.reduce((acc, token) => (acc += token?.balanceUSD || 0), 0)
  );
}
