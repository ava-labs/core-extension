import { MdNotificationsNone } from 'react-icons/md';
import { AnimatedSyncIcon } from '@/components/AnimatedSyncIcon';
import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { useUnreadNotificationsCount } from '@/hooks/useUnreadNotificationsCount';
import { Box, IconButton, Stack, Tooltip, useTheme } from '@avalabs/k2-alpine';
import { Account, isTransferInProgress } from '@core/types';
import { FC, useMemo } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useHistory, useLocation } from 'react-router-dom';
import { ConnectedSites } from '../ConnectedSites';
import { ViewModeSwitcher } from '../ViewModeSwitcher';
import { useTranslation } from 'react-i18next';
import { useTransferTrackingContext } from '@core/ui';

const ICON_BUTTON_SIZE = 'small' as const;

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
  const { transfers, unreadTransferIds } = useTransferTrackingContext();
  const isWalletView = location.pathname.startsWith('/wallet');

  const hasPendingTransactions = useMemo(
    () => (isWalletView ? false : Object.values(pendingTransfers).length > 0),
    [pendingTransfers, isWalletView],
  );

  const hasPendingTransfers = useMemo(
    () => Object.values(transfers).some(isTransferInProgress),
    [transfers],
  );

  const unreadCount = useUnreadNotificationsCount();
  const showNotificationsBadge =
    unreadCount > 0 || unreadTransferIds.length > 0;

  return (
    <Stack direction="row" alignItems="center">
      <ConnectedSites activeAccount={account} />
      <Tooltip title={t('Settings')}>
        <IconButton
          disableRipple={true}
          data-testid="settings-button"
          onClick={() => history.push('/settings')}
          size={ICON_BUTTON_SIZE}
          sx={{ color: theme.palette.text.primary }}
        >
          <FiSettings size={20} style={{ scale: 5 / 6 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Notifications')}>
        <IconButton
          disableRipple
          size={ICON_BUTTON_SIZE}
          data-testid="notifications-button"
          onClick={() => history.push('/notifications')}
          sx={{ color: theme.palette.text.primary, position: 'relative' }}
        >
          {hasPendingTransfers ? (
            <AnimatedSyncIcon size={20} data-active={true} />
          ) : (
            <MdNotificationsNone size={20} />
          )}
          {showNotificationsBadge && (
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
        size={ICON_BUTTON_SIZE}
        onClick={() => history.push('/activity')}
      >
        <AnimatedSyncIcon
          size={24}
          data-active={hasPendingTransactions}
          data-hidden={!hasPendingTransactions}
        />
      </IconButton>
      <ViewModeSwitcher />
    </Stack>
  );
};
