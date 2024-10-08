import { useTranslation } from 'react-i18next';
import { Stack, Typography } from '@avalabs/core-k2-components';

import { PageTitle, PageTitleVariant } from '@src/components/common/PageTitle';

import { NetworkSelector } from './NetworkSelector';

export const BridgeUnknownNetwork = ({
  onSelect,
  network,
  availableChainIds,
}) => {
  const { t } = useTranslation();

  return (
    <Stack height="100%" width="100%">
      <PageTitle variant={PageTitleVariant.PRIMARY}>{t('Back')}</PageTitle>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          mx: 2,
        }}
      >
        <Typography variant="h5">{t('Network not supported.')}</Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
          {t(
            'Network is not supported. Change network to supported network to continue.'
          )}
        </Typography>
        <NetworkSelector
          testId="NonBridgableChainNetworkSelector"
          chainIds={availableChainIds}
          selected={network}
          onSelect={onSelect}
        />
      </Stack>
    </Stack>
  );
};
