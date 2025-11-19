import { TxHistoryItem } from '@core/types';
import { FC } from 'react';
import { FormattedCollectible } from '../../../../../../CollectiblesTab/CollectiblesTab';
import { CollectibleCard } from '../../../../../../CollectiblesTab/components/CollectibleCard';

type Props = {
  token: TxHistoryItem['tokens'][number] | undefined;
};

/**
 * Placeholder component for NFTs.
 * Will be completed with CP-12616 */
export const CollectibleMedia: FC<Props> = ({ token }) => {
  return (
    <CollectibleCard
      collectible={token as unknown as FormattedCollectible}
      onClick={() => {}}
      onImageDimensions={() => {}}
      showTokenId={false}
    />
  );
};
