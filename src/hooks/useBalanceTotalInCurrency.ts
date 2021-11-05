import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useBalanceTotalInCurrency() {
  const { avaxToken } = useWalletContext();
  const tokensWBalances = useTokensWithBalances();

  return (
    ((Number(avaxToken?.balanceUsdDisplayValue) || 0) as number) +
    tokensWBalances.reduce((acc, token) => (acc += token?.balanceUSD || 0), 0)
  );
}
