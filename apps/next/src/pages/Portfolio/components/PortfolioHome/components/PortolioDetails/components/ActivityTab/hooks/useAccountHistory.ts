import { Network, TxHistoryItem } from '@core/types';
import { useWalletContext } from '@core/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { resolveTxNumericChainId } from '../utils/resolveTxNumericChainId';

export const PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY = 'portfolioActivityHistory';

function otherPortfolioActivityPredicate(excludeNumericChainId: number) {
  return (query: { queryKey: readonly unknown[] }): boolean => {
    const [prefix, keyChainId] = query.queryKey;
    if (prefix !== PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY) {
      return false;
    }
    const numericKeyId = Number(keyChainId);
    if (!Number.isFinite(numericKeyId)) {
      return false;
    }
    return numericKeyId !== excludeNumericChainId;
  };
}

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const queryClient = useQueryClient();
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
  });

  useEffect(() => {
    if (!queryEnabled) {
      return;
    }
    const predicate = otherPortfolioActivityPredicate(numericNetworkId);
    // Drop other networks' activity only — clearing the active query left it pending forever.
    void queryClient.cancelQueries({ predicate });
    queryClient.removeQueries({ predicate });
  }, [numericNetworkId, queryClient, queryEnabled]);

  const filteredHistory = useMemo(() => {
    if (rawData === undefined) {
      return null;
    }
    return rawData.filter(
      (tx) => resolveTxNumericChainId(tx.chainId) === numericNetworkId,
    );
  }, [rawData, numericNetworkId]);

  if (!queryEnabled) {
    return [];
  }
  if (isPending) {
    return null;
  }
  if (isError) {
    return [];
  }
  return filteredHistory ?? [];
}
