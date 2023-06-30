import { FeatureGates } from '@avalabs/posthog-sdk';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Stack } from '@avalabs/k2-components';

import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useDefiPortfolio } from '@src/pages/DeFi/hooks/useDefiPortfolio';
import { useFeatureFlagContext } from '@src/contexts/FeatureFlagsProvider';
import { FunctionIsOffline } from '@src/components/common/FunctionIsOffline';

import { DefiProtocolListItem } from './components/DefiProtocolListItem';
import { DefiZeroState } from './components/DefiZeroState';
import { DefiErrorState } from './components/DefiErrorState';

export function DeFi() {
  const { t } = useTranslation();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const { portfolio, hasError, isLoading } = useDefiPortfolio(
    activeAccount?.addressC
  );
  const { featureFlags } = useFeatureFlagContext();

  if (!featureFlags[FeatureGates.DEFI]) {
    return <FunctionIsOffline hidePageTitle functionName={t('DeFi')} />;
  }

  const isProperlyLoaded = !isLoading && !hasError;
  const isZeroState = isProperlyLoaded && portfolio.protocols.length === 0;
  const hasProtocols = isProperlyLoaded && portfolio.protocols.length > 0;

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
      {isLoading && <CircularProgress sx={{ mt: 9 }} size={100} />}
      {hasError && <DefiErrorState />}
      {isZeroState && <DefiZeroState />}
      {hasProtocols && (
        <Stack sx={{ gap: 1, width: '100%' }}>
          {portfolio.protocols.map((protocol) => (
            <DefiProtocolListItem key={protocol.id} protocol={protocol} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
