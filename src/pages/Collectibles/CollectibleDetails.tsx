import {
  Button,
  Divider,
  Stack,
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
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

type AttributeTypographyProps = Exclude<TypographyProps, 'variant' | 'sx'>;

const AttributeLabel = (props: AttributeTypographyProps) => (
  <Typography {...props} variant="body2" />
);

const AttributeData = (props: AttributeTypographyProps) => (
  <Typography
    {...props}
    variant="h6"
    sx={{ wordWrap: 'break-word', fontWeight: 'fontWeightSemibold' }}
  />
);

export function CollectibleDetails() {
  const { t } = useTranslation();
  const setCollectibleParams = useSetCollectibleParams();
  const { nft } = useCollectibleFromParams();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();

  const sendRef = useRef<HTMLButtonElement>(null);

  const [showThumbnail, setShowThumbnail] = useState(false);

  if (!nft) {
    return <Redirect to={`/home?activeTab=${PortfolioTabs.COLLECTIBLES}`} />;
  }

  return (
    <Stack
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
        <Stack
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
              capture('CollectibleSendClicked', {
                chainId: network?.chainId,
                type: nft.type,
              });
              setCollectibleParams({
                nft,
                options: { path: '/collectible/send' },
              });
            }}
            ref={sendRef}
          >
            {t('Send')}
          </Button>
          <Typography variant="h5">{t('Description')}</Typography>
          <Stack
            sx={{
              mt: 2,
              mb: 4,
              gap: '15px',
            }}
          >
            <Stack>
              <AttributeLabel>{t('Collection')}</AttributeLabel>
              <AttributeData>{nft.collectionName}</AttributeData>
            </Stack>
            <Stack>
              <AttributeLabel>{t('Description')}</AttributeLabel>
              <AttributeData>{nft?.description}</AttributeData>
            </Stack>
          </Stack>

          {nft?.attributes && nft.attributes.length > 0 && (
            <Typography variant="h5">{t('Properties')}</Typography>
          )}
          <Stack
            sx={{
              pt: 2,
              pb: 4,
            }}
          >
            {nft?.attributes?.map((attribute, i) => (
              <Stack key={i}>
                {i !== 0 && <Divider sx={{ my: 2 }} />}
                <AttributeLabel>{attribute.name}</AttributeLabel>
                <AttributeData>{attribute.value}</AttributeData>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Scrollbars>
    </Stack>
  );
}
