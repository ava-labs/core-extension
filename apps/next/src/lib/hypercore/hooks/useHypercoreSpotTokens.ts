import { useQuery } from '@tanstack/react-query';
import { useIsHyperliquidEnabled, useIsMainnet } from '@core/ui';
import { getSpotMeta } from '../infoClient';
import { toHypercoreSpotTokens } from '../spotTokens';

export const HYPERCORE_SPOT_TOKENS_QUERY_KEY = 'hypercoreSpotTokens';
const SPOT_META_STALE_TIME_MS = 60 * 60 * 1000;

export const useHypercoreSpotTokens = ({
  enabled: enabledOverride = true,
}: {
  enabled?: boolean;
} = {}) => {
  const isHyperliquidEnabled = useIsHyperliquidEnabled();
  const isMainnet = useIsMainnet();
  const enabled = enabledOverride && isHyperliquidEnabled && isMainnet;

  return useQuery({
    enabled,
    staleTime: SPOT_META_STALE_TIME_MS,
    queryKey: [HYPERCORE_SPOT_TOKENS_QUERY_KEY],
    queryFn: async ({ signal }) => {
      const { tokens } = await getSpotMeta({ signal });
      return toHypercoreSpotTokens(tokens);
    },
  });
};
