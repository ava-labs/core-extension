import { useWalletContext } from '@src/contexts/WalletProvider';
import { useTokensWithBalances } from './useTokensWithBalances';

export function useBalanceTotalInCurrency() {
  const { avaxToken } = useWalletContext();
  const tokensWBalances = useTokensWithBalances();

  // don't freak users out by display falsely a 0 balance when we just don't know the usd value
  if (avaxToken?.balanceUsdDisplayValue === undefined) {
    return null;
  }

  return (
    ((Number(avaxToken?.balanceUsdDisplayValue) || 0) as number) +
    tokensWBalances.reduce((acc, token) => (acc += token?.balanceUSD || 0), 0)
  );
}
