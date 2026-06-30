import { skipToken, useQuery } from '@tanstack/react-query';
import { ServiceType, TransferManager } from '@avalabs/fusion-sdk';

import { isNotNullish } from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useAssetAndChain } from './useAssetAndChain/useAssetAndChain';

type UseFusionMinimumTransferAmountParams = {
  selectedFromToken: FungibleTokenBalance | undefined;
  selectedToToken: FungibleTokenBalance | undefined;
  transferManager: TransferManager | undefined;
  serviceType?: ServiceType;
};

export const useFusionMinimumTransferAmount = ({
  selectedFromToken,
  selectedToToken,
  transferManager,
  serviceType,
}: UseFusionMinimumTransferAmountParams) => {
  const { asset: sourceAsset, chain: sourceChain } =
    useAssetAndChain(selectedFromToken);
  const { asset: targetAsset, chain: targetChain } =
    useAssetAndChain(selectedToToken);

  const fromTokenId = selectedFromToken
    ? getUniqueTokenId(selectedFromToken)
    : undefined;
  const toTokenId = selectedToToken
    ? getUniqueTokenId(selectedToToken)
    : undefined;

  return useQuery({
    queryKey: ['useFusionMinimumTransferAmount', fromTokenId, toTokenId],
    queryFn:
      transferManager &&
      sourceAsset &&
      sourceChain &&
      targetAsset &&
      targetChain
        ? () =>
            transferManager.getMinimumTransferAmount({
              sourceAsset,
              sourceChainId: sourceChain.chainId,
              targetAsset,
              targetChainId: targetChain.chainId,
            })
        : skipToken,
    select: (minimumAmounts) => {
      if (!minimumAmounts) {
        return undefined;
      }

      if (serviceType) {
        return minimumAmounts[serviceType] ?? undefined;
      }

      const amounts = Object.values(minimumAmounts).filter(isNotNullish);

      if (amounts.length === 0) {
        return undefined;
      }

      return amounts.reduce((a, b) => (a < b ? a : b));
    },
  });
};
