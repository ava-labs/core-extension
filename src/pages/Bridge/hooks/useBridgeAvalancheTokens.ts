import { ChainId } from '@avalabs/chains-sdk';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

export function useBridgeAvalancheTokens() {
  const isMainnet = useIsMainnet();

  const chainId = isMainnet
    ? ChainId.AVALANCHE_MAINNET_ID
    : ChainId.AVALANCHE_TESTNET_ID;

  return useTokensWithBalances(true, chainId);
}
