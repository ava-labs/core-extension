import { uniq } from 'lodash';
import { ChainId } from '@avalabs/core-chains-sdk';

import { ChainListWithCaipIds } from '@src/background/services/network/models';

export function getIncludedNetworks(
  isMainnet: boolean,
  currentChainList: ChainListWithCaipIds,
  favoriteChainIds: number[]
) {
  const cChainId = isMainnet
    ? ChainId.AVALANCHE_MAINNET_ID
    : ChainId.AVALANCHE_TESTNET_ID;
  const currentEnvNetworks = Object.keys(currentChainList).map(Number);

  return uniq(
    [cChainId, ...getXPChainIds(isMainnet), ...favoriteChainIds].filter(
      (chainId) => currentEnvNetworks.includes(chainId)
    )
  );
}

export function getXPChainIds(isMainnet: boolean) {
  const xChainId = isMainnet ? ChainId.AVALANCHE_X : ChainId.AVALANCHE_TEST_X;
  const pChainId = isMainnet ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_TEST_P;

  return [pChainId, xChainId];
}
