import { uniq } from 'lodash';

import { ChainListWithCaipIds, NetworkWithCaipId } from '@core/types';
import { getDefaultChainIds, isNotNullish } from '@core/common';

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

export const removeChainPrefix = (address: string) =>
  address.replace(/^[PXC]-/i, '');
