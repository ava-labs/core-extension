import {
  Button,
  Divider,
  RefreshIcon,
  Skeleton,
  Stack,
  ToastCard,
  Tooltip,
  Typography,
  TypographyProps,
  toast,
} from '@avalabs/core-k2-components';

import { PageTitle } from '@src/components/common/PageTitle';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CollectibleMedia } from './components/CollectibleMedia';
import { useCollectibleFromParams } from './hooks/useCollectibleFromParams';
import { useSetCollectibleParams } from './hooks/useSetCollectibleParams';
import { useTranslation } from 'react-i18next';
import { PortfolioTabs } from '../Home/components/Portfolio/Portfolio';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useErrorMessage } from '@src/hooks/useErrorMessage';
import { TokenType } from '@avalabs/vm-module-types';
import { parseRawAttributesString } from '@src/utils/nfts/metadataParser';
import { isAvalancheNetwork } from 'packages/service-worker/src/services/network/utils/isAvalancheNetwork';

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
  const { refreshNftMetadata } = useBalancesContext();
  const { capture } = useAnalyticsContext();
  const { network } = useNetworkContext();

  const sendRef = useRef<HTMLButtonElement>(null);

  const [showThumbnail, setShowThumbnail] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [wasRefreshed, setWasRefreshed] = useState(false);
  const getTranslatedError = useErrorMessage();

  const canRefreshMetadata = useMemo(() => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const refreshBackoff = 3600;

    if (!nft || wasRefreshed) {
      return false;
    }

    return !nft.updatedAt || currentTimestamp > nft.updatedAt + refreshBackoff;
  }, [nft, wasRefreshed]);

  const metadata = useMemo(() => {
    return parseRawAttributesString(nft?.metadata?.properties);
  }, [nft]);

  const refreshMetadata = useCallback(async () => {
    if (!nft || !network) {
      return;
    }

    setIsRefreshing(true);

    try {
      await refreshNftMetadata(
        nft.address,
        String(network.chainId),
        nft.tokenId,
      );
      toast.success(t('NFT metadata was refreshed successfully!'));
      setWasRefreshed(true);
    } catch (err: any) {
      const { title, hint } = getTranslatedError(err);

      toast.custom(
        <ToastCard variant="error">
          <Typography variant="subtitle2">{title}</Typography>
          {hint && (
            <Typography variant="caption" color="text.primary">
              {hint}
            </Typography>
          )}
        </ToastCard>,
        { duration: 5000 },
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [getTranslatedError, network, nft, refreshNftMetadata, t]);

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
      <Stack
        direction="row"
        sx={{ mt: 2.5, mb: 0.5, pr: 1, alignItems: 'center' }}
      >
        <PageTitle
          margin="0"
          thumbnailImage={showThumbnail ? nft?.logoUri : ''}
        >
          {nft?.name}
        </PageTitle>
        {/* The refresh is triggering a glacier reindex. Ethereum is using DeBank, this call is failing on that chain */}
        {network && isAvalancheNetwork(network) && (
          <Tooltip
            title={
              canRefreshMetadata
                ? ''
                : t('Refresh is only available once per hour.')
            }
          >
            <Button
              variant="text"
              size="large"
              color="primary"
              disabled={!canRefreshMetadata || isRefreshing}
              sx={{ p: 0 }}
              onClick={refreshMetadata}
              disableRipple
              data-testid="refresh-nft-metadata"
            >
              <RefreshIcon size={24} />
            </Button>
          </Tooltip>
        )}
      </Stack>
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
          {isRefreshing ? (
            <Skeleton variant="rectangular" width="100%" height="300px" />
          ) : (
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
          )}
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
                options: {
                  path: '/collectible/send',
                },
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

          {metadata.length > 0 && (
            <Typography variant="h5">{t('Properties')}</Typography>
          )}
          <Stack
            sx={{
              pt: 2,
              pb: 4,
            }}
          >
            {metadata.map((attribute, i) => (
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
