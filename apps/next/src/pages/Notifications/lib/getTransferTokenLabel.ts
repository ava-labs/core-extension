import { ServiceType, Transfer } from '@avalabs/fusion-sdk';

import { caipToChainId } from '@core/common';

import { getChainFilterName } from '@/components/TokenSelect/utils';

export const getTransferTokenLabel = (
  transfer: Transfer,
  side: 'source' | 'target',
) => {
  const asset = side === 'source' ? transfer.sourceAsset : transfer.targetAsset;
  const chain = side === 'source' ? transfer.sourceChain : transfer.targetChain;

  if (transfer.type !== ServiceType.AVALANCHE_CCT) {
    return asset.symbol;
  }

  return `${asset.symbol} (${getChainFilterName(caipToChainId(chain.chainId))})`;
};
