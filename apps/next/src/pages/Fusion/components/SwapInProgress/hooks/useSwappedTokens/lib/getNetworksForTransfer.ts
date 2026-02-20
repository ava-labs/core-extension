import { uniq } from 'lodash';
import { Transfer } from '@avalabs/unified-asset-transfer';

import { isNotNullish } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export const getNetworksForTransfer = (
  transfer: Transfer,
  getNetwork: (chainId) => NetworkWithCaipId | undefined,
) => {
  return uniq([
    transfer.sourceChain.chainId,
    transfer.targetChain.chainId,
    transfer.fees.map((fee) => fee.chainId),
  ])
    .map(getNetwork)
    .filter(isNotNullish);
};
