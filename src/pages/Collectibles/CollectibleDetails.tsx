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
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { CollectibleMedia } from './components/CollectibleMedia';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { useTranslation } from 'react-i18next';
import { PortfolioTabs } from '../Home/components/Portfolio/Portfolio';

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
  const { t } = useTranslation();
  const setCollectibleParams = useSetCollectibleParams();
  const { nft } = useCollectibleFromParams();

  const sendRef = useRef<HTMLButtonElement>(null);

  const [showThumbnail, setShowThumbnail] = useState(false);

  if (!nft) {
    return <Redirect to={`/home?activeTab=${PortfolioTabs.COLLECTIBLES}`} />;
  }
  return (
    <VerticalFlex width={'100%'} height="100%">
      <PageTitle thumbnailImage={showThumbnail ? nft?.logoUri : ''}>
        {nft?.name}
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
            url={nft?.logoUri}
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
                options: { path: '/collectible/send' },
              });
            }}
            ref={sendRef}
          >
            {t('Send')}
          </PrimaryButton>
          <Typography size={18} height="22px" weight={700}>
            {t('Description')}
          </Typography>
          <VerticalFlex margin="16px 0 32px">
            <VerticalFlex>
              <AttributeLabel>{t('Collection name')}</AttributeLabel>
              <AttributeData>{nft.collectionName}</AttributeData>
            </VerticalFlex>
            <HorizontalSeparator margin="16px 0" />
            <VerticalFlex>
              <AttributeLabel>{t('Description')}</AttributeLabel>
              <AttributeData>{nft?.description}</AttributeData>
            </VerticalFlex>
          </VerticalFlex>

          {nft?.attributes && nft.attributes.length > 0 && (
            <Typography size={18} height="22px" weight={700}>
              {t('Properties')}
            </Typography>
          )}
          <VerticalFlex margin="16px 0 32px">
            {nft?.attributes?.map((attribute, i) => (
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
