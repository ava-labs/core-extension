import {
  ComponentSize,
  HorizontalSeparator,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { PageTitle } from '@src/components/common/PageTitle';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CollectibleMedia } from './components/CollectibleMedia';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';

const AttributeLabel = styled(Typography)`
  font-size: 14px;
  line-height: 17px;
  margin: 0 0 4px;
`;

const AttributeData = styled(Typography)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
`;

export function CollectibleDetails() {
  const history = useHistory();
  const setCollectibleParams = useSetCollectibleParams();
  const { nft, tokenId } = useCollectibleFromParams();

  const sendRef = useRef<HTMLButtonElement>(null);

  const [showThumbnail, setShowThumbnail] = useState(false);

  const nftItem = nft?.nftData.find((data) => data.tokenId === tokenId);

  if (!nft || !nftItem) {
    history.goBack();
    return null;
  }

  return (
    <VerticalFlex width={'100%'} height="100%">
      <PageTitle
        thumbnailImage={showThumbnail ? nftItem.externalData?.image : ''}
      >
        {nftItem.externalData?.name}
      </PageTitle>
      <Scrollbars
        style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
        onScrollFrame={({ scrollTop }) => {
          // offsetTop corrected with margin
          if (sendRef.current && scrollTop >= sendRef.current.offsetTop - 24) {
            setShowThumbnail(true);
          } else {
            setShowThumbnail(false);
          }
        }}
      >
        <VerticalFlex padding="0 16px">
          <CollectibleMedia
            width="100%"
            height="auto"
            url={nftItem.externalData?.image}
            hover={false}
            margin="8px 0"
            controls={true}
            showPlayIcon={false}
          />
          <PrimaryButton
            margin="24px 0"
            width="100%"
            size={ComponentSize.LARGE}
            onClick={() => {
              setCollectibleParams({
                nft,
                tokenId,
                options: { path: '/collectible/send' },
              });
            }}
            ref={sendRef}
          >
            Send
          </PrimaryButton>
          <Typography size={18} height="22px" weight={700}>
            Description
          </Typography>
          <VerticalFlex margin="16px 0 32px">
            <VerticalFlex>
              <AttributeLabel>Collection name</AttributeLabel>
              <AttributeData>{nft.contractName}</AttributeData>
            </VerticalFlex>
            <HorizontalSeparator margin="16px 0" />
            <VerticalFlex>
              <AttributeLabel>Description</AttributeLabel>
              <AttributeData>{nftItem.externalData?.description}</AttributeData>
            </VerticalFlex>
          </VerticalFlex>

          {nftItem.externalData?.attributes &&
            nftItem.externalData.attributes.length > 0 && (
              <Typography size={18} height="22px" weight={700}>
                Properties
              </Typography>
            )}
          <VerticalFlex margin="16px 0 32px">
            {nftItem.externalData?.attributes?.map((attribute, i) => (
              <VerticalFlex key={i}>
                {i !== 0 && <HorizontalSeparator margin="16px 0" />}
                <AttributeLabel>{attribute.name}</AttributeLabel>
                <AttributeData>{attribute.value}</AttributeData>
              </VerticalFlex>
            ))}
          </VerticalFlex>
        </VerticalFlex>
      </Scrollbars>
    </VerticalFlex>
  );
}
