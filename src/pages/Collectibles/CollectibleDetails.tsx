import {
  Button,
  Divider,
  Typography,
  TypographyProps,
} from '@avalabs/k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CollectibleMedia } from './components/CollectibleMedia';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { useTranslation } from 'react-i18next';
import { PortfolioTabs } from '../Home/components/Portfolio/Portfolio';
import { TokenType } from '@src/background/services/balances/models';
import { VerticalStack } from '@src/components/common/VerticalStack';

type AttributeTypographyProps = Exclude<TypographyProps, 'variant' | 'sx'>;

const AttributeLabel = (props: AttributeTypographyProps) => (
  <Typography {...props} variant="body2" />
);

const AttributeData = (props: AttributeTypographyProps) => (
  <Typography {...props} variant="h6" sx={{ wordWrap: 'break-word' }} />
);

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
    <VerticalStack
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
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
        <VerticalStack
          sx={{
            px: 2,
          }}
        >
          <CollectibleMedia
            width="343px"
            height="auto"
            url={nft?.logoUri}
            hover={false}
            margin="8px 0"
            controls={true}
            showPlayIcon={false}
            showBalance={TokenType.ERC1155 === nft.type}
            balance={nft.balance}
            showExpandOption={true}
          />
          <Button
            size="large"
            sx={{
              my: 3,
            }}
            onClick={() => {
              setCollectibleParams({
                nft,
                options: { path: '/collectible/send' },
              });
            }}
            ref={sendRef}
          >
            {t('Send')}
          </Button>
          <Typography variant="h4">{t('Description')}</Typography>
          <VerticalStack
            sx={{
              mt: 2,
              mb: 4,
              display: 'flex',
              gap: '15px',
            }}
          >
            <VerticalStack>
              <AttributeLabel>{t('Collection')}</AttributeLabel>
              <AttributeData>{nft.collectionName}</AttributeData>
            </VerticalStack>
            <VerticalStack>
              <AttributeLabel>{t('Description')}</AttributeLabel>
              <AttributeData>{nft?.description}</AttributeData>
            </VerticalStack>
          </VerticalStack>

          {nft?.attributes && nft.attributes.length > 0 && (
            <Typography variant="h4">{t('Properties')}</Typography>
          )}
          <VerticalStack
            sx={{
              pt: 2,
              pb: 4,
            }}
          >
            {nft?.attributes?.map((attribute, i) => (
              <VerticalStack key={i}>
                {i !== 0 && <Divider sx={{ my: 2 }} />}
                <AttributeLabel>{attribute.name}</AttributeLabel>
                <AttributeData>{attribute.value}</AttributeData>
              </VerticalStack>
            ))}
          </VerticalStack>
        </VerticalStack>
      </Scrollbars>
    </VerticalStack>
  );
}
