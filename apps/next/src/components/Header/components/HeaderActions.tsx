import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { IconButton, Stack, Tooltip, useTheme } from '@avalabs/k2-alpine';
import { Account, FeatureGates } from '@core/types';
import { FC, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import { ConnectedSites } from '../ConnectedSites';
import { ViewModeSwitcher } from '../ViewModeSwitcher';
import { useTranslation } from 'react-i18next';
import { useFeatureFlagContext, useTransferTrackingContext } from '@core/ui';

type Props = {
  account: Account | undefined;
};

export const HeaderActions: FC<Props> = ({ account }) => {
  const history = useHistory();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();
  const { transfers } = useTransferTrackingContext();
  const { isFlagEnabled } = useFeatureFlagContext();
  const isWalletView = location.pathname.startsWith('/wallet');

  const hasPendingTransactions = useMemo(
    () => (isWalletView ? false : Object.values(pendingTransfers).length > 0),
    [pendingTransfers, isWalletView],
  );

  const hasPendingTransfers = useMemo(
    () => Object.values(transfers).length > 0,
    [transfers],
  );

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={account} />
      <Tooltip title={t('Settings')}>
        <IconButton
          disableRipple={true}
          data-testid="settings-button"
          onClick={() => history.push('/settings')}
          size="small"
          sx={{ color: theme.palette.text.primary }}
        >
          <FiSettings size={20} style={{ scale: 5 / 6 }} />
        </IconButton>
      </Tooltip>
      <IconButton
        disableRipple={true}
        size="small"
        onClick={() => history.push('/activity')}
      >
        <AnimatedSyncIcon
          size={24}
          data-active={hasPendingTransactions}
          data-hidden={!hasPendingTransactions}
        />
      </IconButton>
      {isFlagEnabled(FeatureGates.FUSION_FEATURE) && (
        <IconButton
          disableRipple
          size="small"
          onClick={() => history.push('/fusion-activity')}
        >
          <AnimatedSyncIcon
            size={24}
            data-active={hasPendingTransfers}
            data-hidden={!hasPendingTransfers}
          />
        </IconButton>
      )}
      <ViewModeSwitcher />
    </Stack>
  );
};
