import { useTokenInfoContext } from '@avalabs/core-bridge-sdk';

// This is a copy from https://github.com/ava-labs/core-web-properties/blob/develop/packages/web/src/hooks/bridge/useCoingeckoId.ts

const KNOWN_IDS = {
  BTC: 'bitcoin',
  AVAX: 'avalanche-2',
  ETH: 'ethereum',
};

export const useCoinGeckoId = (tokenSymbol?: string): string | undefined => {
  const tokenInfoData = useTokenInfoContext();

  return (
    tokenSymbol &&
    (KNOWN_IDS[tokenSymbol] || tokenInfoData?.[tokenSymbol]?.coingeckoId)
  );
};
