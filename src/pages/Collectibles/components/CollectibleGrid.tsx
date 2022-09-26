import { TextButton } from '@avalabs/react-components';
import { NftTokenWithBalance } from '@src/background/services/balances/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { CollectibleMedia } from './CollectibleMedia';

const StyledMasonry = styled(Masonry)`
  display: flex;
  padding-bottom: 72px;

  .masonryColumn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 0 0 16px;

    &:last-of-type {
      align-items: flex-end;
      padding: 0 16px 0 0;
    }
  }
`;

export function CollectibleGrid({
  onClick,
}: {
  onClick: (nft: NftTokenWithBalance) => void;
}) {
  const { nfts } = useBalancesContext();
  return (
    <StyledMasonry
      className="masonry"
      breakpointCols={2}
      columnClassName="masonryColumn"
    >
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
    </StyledMasonry>
  );
}
