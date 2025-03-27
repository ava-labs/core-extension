import { uniq } from 'lodash';

import {
  ChainListWithCaipIds,
  NetworkWithCaipId,
} from '@src/background/services/network/models';
import { getDefaultChainIds } from '@src/utils/getDefaultChainIds';
import { isNotNullish } from '@src/utils/typeUtils';

export function getIncludedNetworks(
  isMainnet: boolean,
  currentChainList: ChainListWithCaipIds,
  favoriteChainIds: number[],
): NetworkWithCaipId[] {
  const currentEnvChainIds = Object.keys(currentChainList).map(Number);
  const includedChainIds = uniq(
    [...getDefaultChainIds(isMainnet), ...favoriteChainIds].filter((chainId) =>
      currentEnvChainIds.includes(chainId),
    ),
  );

  return includedChainIds
    .map((chainId) => currentChainList[chainId])
    .filter(isNotNullish);
}
