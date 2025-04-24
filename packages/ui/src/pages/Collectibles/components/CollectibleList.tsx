import { CollectibleMedia } from './CollectibleMedia';
import { Stack } from '@avalabs/core-k2-components';
import { TokenCard } from 'packages/ui/src/components/common/TokenCard';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { useNfts } from '@src/hooks/useNfts';

export function CollectibleList({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const nfts = useNfts();
  const { getCollectibleVisibility } = useSettingsContext();
  const nftsToShow = nfts?.filter((nft) => {
    return getCollectibleVisibility(nft);
  });

  return (
    <Stack sx={{ px: 2 }} data-testid="collectibles-list">
      {nftsToShow?.map((nft) => {
        return (
          <TokenCard
            name={nft.name}
            balanceInCurrency={`#${nft.tokenId}`}
            key={`${nft.address}-${nft.tokenId}`}
            onClick={() => onClick(nft)}
          >
            <CollectibleMedia
              height="32px"
              width="auto"
              maxWidth="32px"
              url={nft?.logoSmall}
              hover={false}
              margin="8px 0"
              showPlayIcon={false}
            />
          </TokenCard>
        );
      })}
    </Stack>
  );
}
