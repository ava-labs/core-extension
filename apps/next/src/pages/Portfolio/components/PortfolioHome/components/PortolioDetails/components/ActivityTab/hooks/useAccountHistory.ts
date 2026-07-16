import { Network, TxHistoryItem } from '@core/types';
import {
  useAccountsContext,
  useIsHyperliquidEnabled,
  useWalletContext,
} from '@core/ui';
import { HYPERCORE_CHAIN_ID } from '@core/common';
import { useQuery } from '@tanstack/react-query';

export const PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY = 'portfolioActivityHistory';

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const { getTransactionHistory } = useWalletContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const isHyperliquidEnabled = useIsHyperliquidEnabled();

  const numericNetworkId = Number(networkId);
  const isHypercore = numericNetworkId === HYPERCORE_CHAIN_ID;
  const queryEnabled =
    Number.isFinite(numericNetworkId) &&
    numericNetworkId > 0 &&
    (!isHypercore || (isHyperliquidEnabled && Boolean(active?.addressC)));

  const {
    data: rawData,
    isPending,
    isError,
  } = useQuery({
    queryKey: [
      PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY,
      numericNetworkId,
      isHypercore ? active?.addressC : undefined,
    ],
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
