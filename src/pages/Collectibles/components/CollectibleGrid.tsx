import { TextButton } from '@avalabs/react-components';
import { NftTokenWithBalance } from '@src/background/services/balances/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { CollectibleMedia } from './CollectibleMedia';
import { CollectibleWrapper } from './CollectibleWrapper';

export function CollectibleGrid({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const { nfts } = useBalancesContext();
  return (
    <CollectibleWrapper>
      {nfts.items?.map((nft) => (
        <TextButton
          key={`${nft.address}-${nft.tokenId}`}
          onClick={() => onClick(nft)}
        >
          <CollectibleMedia
            width="164px"
            height="auto"
            url={nft?.logoUri}
            hover={false}
            margin="0 0 16px"
          />
        </TextButton>
      ))}
    </CollectibleWrapper>
  );
}
