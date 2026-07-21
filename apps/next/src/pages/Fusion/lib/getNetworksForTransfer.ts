import { uniq } from 'lodash';
import { Transfer, Quote } from '@avalabs/fusion-sdk';

import { fromFusionCaipId, isNotNullish } from '@core/common';
import { NetworkWithCaipId, PartialBy } from '@core/types';

export const getNetworksForTransfer = (
  transferLike: Required<
    PartialBy<Transfer | Quote, 'sourceChain' | 'targetChain' | 'fees'>
  >,
  getNetwork: (chainId) => NetworkWithCaipId | undefined,
) => {
  return uniq([
    transferLike.sourceChain.chainId,
    transferLike.targetChain.chainId,
    ...transferLike.fees.map((fee) => fee.chainId),
  ])
    .map((caipId) => getNetwork(fromFusionCaipId(caipId)))
    .filter(isNotNullish);
};
