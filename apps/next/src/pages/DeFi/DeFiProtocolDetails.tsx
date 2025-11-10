import { FC, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  CircularProgress,
  OutboundIcon,
  Stack,
} from '@avalabs/k2-alpine';

import { DeFiProtocolDetailsHeader } from './components/DeFiProtocolDetailsHeader';
import { DeFiErrorState } from './components/DeFiErrorState';
import { DeFiProtocolItemGroup } from './components/DeFiProtocolItemGroup';

import { Page } from '@/components/Page';

import { useDefiContext, useFeatureFlagContext } from '@core/ui';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { openNewTab } from '@core/common';
import { FeatureGates } from '@core/types';
import { DeFiPortfolioFeatureDisabled } from './DeFi';

export const DeFiProtocolDetails: FC = () => {
  const { protocolId } = useParams<{ protocolId: string }>();
  const { t } = useTranslation();

  const history = useHistory();

  const { featureFlags } = useFeatureFlagContext();
  const { portfolio, hasError, isLoading, refresh } = useDefiContext();

  const protocol = useMemo(
    () => portfolio?.protocols.find((p) => p.id === protocolId) ?? null,
    [portfolio, protocolId],
  );

  const goToProtocolPage = useCallback(() => {
    if (protocol?.siteUrl) {
      openNewTab({ url: protocol?.siteUrl });
    }
  }, [protocol]);

  useEffect(() => {
    if (protocolId) {
      refresh();
    }
  }, [refresh, protocolId]);

  if (!featureFlags[FeatureGates.DEFI]) {
    return <DeFiProtocolDetailsFeatureDisabled />;
  }

  return (
    <Page
      withBackButton
      withViewSwitcher
      onBack={() => history.push('/?activeTab=defi')}
      contentProps={{
        justifyContent: 'flex-start',
        mt: 4.5,
      }}
    >
      <Stack gap={1} width="100%" height={1}>
        {isLoading && !hasError && !protocol && <CircularProgress />}
        {hasError && <DeFiErrorState />}
        {protocol && (
          <>
            <DeFiProtocolDetailsHeader protocol={protocol} />
            {protocol.groups.map((group) => (
              <DeFiProtocolItemGroup key={group.name} group={group} />
            ))}
          </>
        )}
      </Stack>

      <Button
        onClick={goToProtocolPage}
        variant="contained"
        color="primary"
        size="medium"
        fullWidth
        endIcon={<OutboundIcon size={16} />}
      >
        {t('See details in {{protocolName}}', { protocolName: protocol?.name })}
      </Button>
    </Page>
  );
};

export const DeFiProtocolDetailsFeatureDisabled: FC = () => {
  const history = useHistory();

  return (
    <Page
      withBackButton
      withViewSwitcher
      onBack={() => history.push('/?activeTab=defi')}
      contentProps={{
        justifyContent: 'flex-start',
        mt: 4.5,
      }}
    >
      <DeFiPortfolioFeatureDisabled />
    </Page>
  );
};
