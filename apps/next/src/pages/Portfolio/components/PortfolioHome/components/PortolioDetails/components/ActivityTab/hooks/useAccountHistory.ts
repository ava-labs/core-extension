import { Network, TxHistoryItem } from '@core/types';
import {
  useAccountsContext,
  useIsHyperliquidEnabled,
  useNetworkContext,
  useWalletContext,
} from '@core/ui';
import { HYPERCORE_CHAIN_ID } from '@core/common';
import { useQuery } from '@tanstack/react-query';
import { fetchHypercoreActivity } from '@/lib/hypercore/activity/fetchHypercoreActivity';
import { mapHypercoreActivityToTxHistoryItems } from '@/lib/hypercore/activity/mapHypercoreActivityToTxHistoryItems';

export const PORTFOLIO_ACTIVITY_HISTORY_QUERY_KEY = 'portfolioActivityHistory';

const DEFAULT_HYPERCORE_EXPLORER = 'https://app.hyperliquid.xyz/explorer';

export function useAccountHistory(
  networkId: Network['chainId'],
): TxHistoryItem[] | null {
  const { getTransactionHistory } = useWalletContext();
  const {
    accounts: { active },
  } = useAccountsContext();
  const { getNetwork } = useNetworkContext();
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
    queryFn: async ({ signal }) => {
      if (isHypercore) {
        const address = active?.addressC;
        if (!address) {
          return [];
        }
        const explorerNetwork = getNetwork(HYPERCORE_CHAIN_ID) ?? {
          explorerUrl: DEFAULT_HYPERCORE_EXPLORER,
        };
        const items = await fetchHypercoreActivity(address, { signal });
        return mapHypercoreActivityToTxHistoryItems(
          items,
          address,
          explorerNetwork,
        );
      }

      return getTransactionHistory(numericNetworkId);
    },
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
