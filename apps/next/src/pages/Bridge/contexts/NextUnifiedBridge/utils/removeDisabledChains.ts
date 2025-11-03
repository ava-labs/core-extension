import { ChainId } from '@avalabs/core-chains-sdk';
import { chainIdToCaip } from '@core/common';
import { FeatureGates } from '@core/types';

export function removeDisabledChains(
  networkIds: string[],
  isGatedFeature: (feature: FeatureGates) => boolean,
) {
  if (!isGatedFeature(FeatureGates.BRIDGE_BTC)) {
    removeChains(networkIds, ChainId.BITCOIN, ChainId.BITCOIN_TESTNET);
  }

  if (!isGatedFeature(FeatureGates.BRIDGE_ETH)) {
    removeChains(
      networkIds,
      ChainId.ETHEREUM_HOMESTEAD,
      ChainId.ETHEREUM_TEST_SEPOLIA,
      ChainId.ETHEREUM_TEST_RINKEBY,
      ChainId.ETHEREUM_TEST_GOERLY,
    );
  }

  return networkIds;
}

function removeChains(networkIds: string[], ...chainIds: ChainId[]) {
  chainIds.forEach((chainId) => {
    const index = networkIds.indexOf(chainIdToCaip(chainId));
    if (index !== -1) {
      networkIds.splice(index, 1);
    }
  });
  return networkIds;
}
