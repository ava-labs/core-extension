import { skipToken, useQuery } from '@tanstack/react-query';
import { TransferManager } from '@avalabs/fusion-sdk';

import { isNotNullish } from '@core/common';
import { FungibleTokenBalance, getUniqueTokenId } from '@core/types';

import { useAssetAndChain } from './useAssetAndChain/useAssetAndChain';

type UseFusionMinimumTransferAmountParams = {
  selectedFromToken: FungibleTokenBalance | undefined;
  selectedToToken: FungibleTokenBalance | undefined;
  transferManager: TransferManager | undefined;
};

export const useFusionMinimumTransferAmount = ({
  selectedFromToken,
  selectedToToken,
  transferManager,
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
        ? async () => {
            const minimumAmounts =
              await transferManager.getMinimumTransferAmount({
                sourceAsset,
                sourceChainId: sourceChain.chainId,
                targetAsset,
                targetChainId: targetChain.chainId,
              });

            if (!minimumAmounts) {
              return null;
            }

            const amounts = Object.values(minimumAmounts).filter(isNotNullish);

            if (amounts.length === 0) {
              return null;
            }

            return amounts.reduce((a, b) => (a < b ? a : b));
          }
        : skipToken,
    select: (amount) => amount ?? undefined,
  });
};
