import { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FeatureGates } from '@avalabs/posthog-sdk';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  ExternalLinkIcon,
  Scrollbars,
  Stack,
  Typography,
} from '@avalabs/k2-components';

import { openNewTab } from '@src/utils/extensionUtils';
import { useDefiContext } from '@src/contexts/DefiProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';

import { DefiErrorState } from './components/DefiErrorState';
import { DefiPortfolioItemGroup } from './components/DefiPortfolioItemGroup';
import { DefiProtocolDetailsHeader } from './components/DefiProtocolDetailsHeader';

export function DefiProtocolDetails() {
  const { protocolId } = useParams<{ protocolId: string }>();
  const { t } = useTranslation();
  const history = useHistory();

  const { featureFlags } = useFeatureFlagContext();
  const { hasError, isLoading, portfolio, refresh } = useDefiContext();

  const protocol =
    portfolio?.protocols?.find((p) => p.id === protocolId) ?? null;

  const goToProtocolPage = useCallback(() => {
    if (protocol?.siteUrl) {
      openNewTab({ url: protocol?.siteUrl });
    }
  }, [protocol]);

  // Refresh possibly-stale data upon component render
  useEffect(refresh, [refresh]);

  if (!featureFlags[FeatureGates.DEFI]) {
    return <FunctionIsOffline hidePageTitle functionName={t('DeFi')} />;
  }

  return (
    <Stack
      sx={{
        pt: 1,
        pb: 2,
        px: 2,
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
      }}
    >
      {isLoading && !protocol && <CircularProgress sx={{ mt: 9 }} size={100} />}
      {hasError && <DefiErrorState />}
      {protocol && (
        <>
          <PageTitle
            variant={PageTitleVariant.SECONDARY}
            margin="8px 0 8px -24px"
          />
          <Card sx={{ width: 1, overflow: 'initial', flexGrow: 1 }}>
            <CardContent
              sx={{
                px: 2,
                py: 0,
                height: '100%',
                ':last-child': { pb: 0 },
              }}
            >
              <Stack sx={{ height: '100%' }}>
                <DefiProtocolDetailsHeader protocol={protocol} />
                <Divider sx={{ my: 1 }} />
                <Scrollbars>
                  {protocol.groups.length === 0 ? (
                    <Stack
                      sx={{ mt: 5, gap: 1, alignItems: 'center' }}
                      data-testid="defi-protocol-emptied-state"
                    >
                      <Typography variant="body2" color="text.secondary">
                        {t('No Transactions Found')}
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => history.replace('/home?activeTab=DEFI')}
                        sx={{ mt: 1 }}
                      >
                        {t('Go Back to DeFi Portfolio')}
                      </Button>
                    </Stack>
                  ) : (
                    <Stack
                      sx={{ gap: 1 }}
                      divider={<Divider />}
                      data-testid="defi-protocol-groups"
                    >
                      {protocol.groups.map((group) => (
                        <DefiPortfolioItemGroup
                          key={group.name}
                          group={group}
                        />
                      ))}
                    </Stack>
                  )}
                  {/* Additional padding at the bottom of scroller */}
                  <Box sx={{ width: 1, height: 40 }} />{' '}
                </Scrollbars>
              </Stack>
            </CardContent>
          </Card>
          <Stack
            sx={{
              width: 1,
              flexShrink: 0,
              pt: 2,
              pb: 1,
              justifyContent: 'flex-end',
            }}
          >
            <Button
              fullWidth
              size="large"
              onClick={goToProtocolPage}
              startIcon={<ExternalLinkIcon size={16} />}
              data-testid="defi-protocol-dapp-button"
            >
              {t('Go to {{protocolName}}', { protocolName: protocol.name })}
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
