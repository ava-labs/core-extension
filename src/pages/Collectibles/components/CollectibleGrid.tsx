import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CollectibleMedia } from './CollectibleMedia';
import { CollectibleWrapper } from './CollectibleWrapper';
import { Button } from '@avalabs/core-k2-components';
import type { NftTokenWithBalance } from '@avalabs/vm-module-types';
import { TokenType } from '@avalabs/vm-module-types';
import { useNfts } from '@src/hooks/useNfts';

export function CollectibleGrid({
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
    <CollectibleWrapper>
      {nftsToShow?.map((nft) => {
        return (
          <Button
            sx={{ display: 'flex', padding: 0 }}
            variant="text"
            key={`${nft.address}-${nft.tokenId}`}
            onClick={() => onClick(nft)}
            data-testid={`${nft.name}-${nft.tokenId}`}
          >
            <CollectibleMedia
              width="164px"
              height="auto"
              url={nft?.logoUri}
              hover={false}
              margin="0 0 16px"
              showBalance={TokenType.ERC1155 === nft.type}
              balance={nft.balance}
            />
          </Button>
        );
      })}
    </CollectibleWrapper>
  );
}
