import { NFT } from '@avalabs/blizzard-sdk';
import { TextButton } from '@avalabs/react-components';
import { useWalletContext } from '@src/contexts/WalletProvider';
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
  onClick: (nft: NFT, tokenId: string) => void;
}) {
  const { nfts } = useWalletContext();
  return (
    <StyledMasonry
      className="masonry"
      breakpointCols={2}
      columnClassName="masonryColumn"
    >
      {nfts.map((collection, i) =>
        collection.nftData?.map((nft, j) => (
          <TextButton
            key={`${i}-${j}`}
            onClick={() => onClick(collection, nft.tokenId)}
          >
            <CollectibleMedia
              width="164px"
              height="auto"
              url={nft.externalData.image}
              hover={false}
              margin="0 0 16px"
            />
          </TextButton>
        ))
      )}
    </StyledMasonry>
  );
}
