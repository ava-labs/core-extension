import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { CollectibleMedia } from './CollectibleMedia';
import { CollectibleWrapper } from './CollectibleWrapper';
import { Button } from '@avalabs/core-k2-components';
import { NftTokenWithBalance, TokenType } from '@avalabs/vm-module-types';

export function CollectibleGrid({
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
