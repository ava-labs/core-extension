import { CollectibleMedia } from './CollectibleMedia';
import { Stack } from '@avalabs/core-k2-components';
import { TokenCard } from '@/components/common/TokenCard';
import { useNetworkContext, useSettingsContext } from '@core/ui';
import { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { useNfts } from '@core/ui';

export function CollectibleList({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const { network } = useNetworkContext();
  const { collectibles: nfts } = useNfts();
  const { getCollectibleVisibility } = useSettingsContext();
  const nftsToShow = network?.caipId
    ? nfts?.filter((nft) => {
        return getCollectibleVisibility(nft, network?.caipId);
      })
    : [];

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
