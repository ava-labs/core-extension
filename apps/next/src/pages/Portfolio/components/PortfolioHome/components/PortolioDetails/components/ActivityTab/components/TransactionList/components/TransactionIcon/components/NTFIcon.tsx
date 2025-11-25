import { isNftTokenType } from '@core/common';
import { TxHistoryItem } from '@core/types';
import { FC, useMemo } from 'react';
import { FormattedCollectible } from '../../../../../../CollectiblesTab/CollectiblesTab';
import { CollectibleCard } from '../../../../../../CollectiblesTab/components/CollectibleCard';

type Props = {
  transaction: TxHistoryItem;
  token: TxHistoryItem['tokens'][number] | undefined;
};

/**
 * Placeholder component for NFTs.
 * Will be completed with CP-12616 */
export const NFTIcon: FC<Props> = ({ token, transaction }) => {
  const mappedCollectible = useMemo<FormattedCollectible | null>(() => {
    if (!token || !isNftTokenType(token.type)) {
      return null;
    }

    return {
      logoUri: token.imageUri ?? '',
      type: token.type,
      name: token.name,
      symbol: token.symbol,
      chainId: Number(transaction.chainId),
      address: (transaction.isSender ? token.from : token.to)?.address ?? '',
      uniqueCollectibleId: token.collectableTokenId ?? '',
    } as FormattedCollectible;
  }, [token, transaction]);

  if (!mappedCollectible) {
    return null;
  }

  return (
    <CollectibleCard
      collectible={mappedCollectible}
      onClick={() => {}}
      onImageDimensions={() => {}}
      showTokenId={false}
    />
  );
};
