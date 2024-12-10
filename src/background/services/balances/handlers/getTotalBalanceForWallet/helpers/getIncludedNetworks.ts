import { uniq } from 'lodash';

import { ChainListWithCaipIds } from '@src/background/services/network/models';
import { getDefaultChainIds } from '@src/utils/getDefaultChainIds';

export function getIncludedNetworks(
  isMainnet: boolean,
  currentChainList: ChainListWithCaipIds,
  favoriteChainIds: number[]
) {
  const currentEnvNetworks = Object.keys(currentChainList).map(Number);

  return uniq(
    [...getDefaultChainIds(isMainnet), ...favoriteChainIds].filter((chainId) =>
      currentEnvNetworks.includes(chainId)
    )
  );
}
