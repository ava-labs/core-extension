import { CollectibleMedia } from './CollectibleMedia';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { NftTokenWithBalance } from '@src/background/services/balances/models';
import { Stack } from '@avalabs/core-k2-components';
import { TokenCard } from '@src/components/common/TokenCard';
import { useSettingsContext } from '@src/contexts/SettingsProvider';

export function CollectibleList({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const { nfts } = useBalancesContext();
  const { getCollectibleVisibility } = useSettingsContext();
  const nftsToShow = nfts.items?.filter((nft) => {
    return getCollectibleVisibility(nft);
  });

  return (
    <Stack sx={{ px: 2 }} data-testid="collectibles-list">
      {nftsToShow?.map((nft) => {
        return (
          <TokenCard
            name={nft.name}
            balanceUSD={`#${nft.tokenId}`}
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
