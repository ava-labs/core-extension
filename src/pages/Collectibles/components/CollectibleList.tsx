import { TokenCard, VerticalFlex } from '@avalabs/react-components';
import { CollectibleMedia } from './CollectibleMedia';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { NftTokenWithBalance } from '@src/background/services/balances/models';

export function CollectibleList({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const { nfts } = useBalancesContext();
  return (
    <VerticalFlex padding="0 16px 72px">
      {nfts.items?.map((nft) => (
        <TokenCard
          name={nft.name}
          symbol={''}
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
      ))}
    </VerticalFlex>
  );
}
