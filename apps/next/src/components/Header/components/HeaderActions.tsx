import { MdNotificationsNone } from 'react-icons/md';
import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { useUnreadCount } from '@/pages/Notifications/hooks/useNotificationCenter';
import { Box, IconButton, Stack, Tooltip, useTheme } from '@avalabs/k2-alpine';
import { Account, FeatureGates, isTransferInProgress } from '@core/types';
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
    () => Object.values(transfers).some(isTransferInProgress),
    [transfers],
  );
  const hasConcludedTransfers = useMemo(
    () =>
      Object.values(transfers).some(
        (transfer) => !isTransferInProgress(transfer),
      ),
    [transfers],
  );
  const displayFusionActivityIcon =
    isFlagEnabled(FeatureGates.FUSION_FEATURE) &&
    (hasPendingTransfers || hasConcludedTransfers);

  const unreadCount = useUnreadCount();

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
      <Tooltip title={t('Notifications')}>
        <IconButton
          disableRipple
          size="small"
          data-testid="notifications-button"
          onClick={() => history.push('/notifications')}
          sx={{ color: theme.palette.text.primary, position: 'relative' }}
        >
          <MdNotificationsNone size={20} />
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top={4}
              right={4}
              bgcolor="error.main"
              borderRadius="50%"
              width={6}
              height={6}
            />
          )}
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
      {displayFusionActivityIcon && (
        <IconButton
          disableRipple
          size="small"
          onClick={() => history.push('/fusion-activity')}
          sx={{ color: theme.palette.text.primary, position: 'relative' }}
        >
          {hasPendingTransfers ? (
            <AnimatedSyncIcon
              size={24}
              data-active={hasPendingTransfers}
              data-hidden={!hasPendingTransfers}
            />
          ) : (
            <>
              <MdNotificationsNone size={20} />
              {/* TODO: only display the badge for unseen transfers*/}
              <Box
                position="absolute"
                top={4}
                right={4}
                bgcolor="error.main"
                borderRadius="50%"
                width={6}
                height={6}
              />
            </>
          )}
        </IconButton>
      )}
      <ViewModeSwitcher />
    </Stack>
  );
};
