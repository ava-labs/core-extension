import { Network, TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';
import { useQuery } from '@tanstack/react-query';

export const PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY = 'portfolioActivityHistory';

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const { getTransactionHistory } = useWalletContext();
  const numericNetworkId = Number(networkId);
  const queryEnabled =
    Number.isFinite(numericNetworkId) && numericNetworkId > 0;

  const {
    data: rawData,
    isPending,
    isError,
  } = useQuery({
    queryKey: [PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY, numericNetworkId],
    queryFn: () => getTransactionHistory(numericNetworkId),
    enabled: queryEnabled,
    structuralSharing: false,
    // Keyed by chain; drop inactive networks from cache immediately so switching
    // networks does not keep stale in-flight rows or resurrect old-chain data.
    gcTime: 0,
  });

  if (!queryEnabled) {
    return [];
  }
  if (isPending) {
    return null;
  }
  if (isError) {
    return [];
  }
  return rawData ?? [];
}
