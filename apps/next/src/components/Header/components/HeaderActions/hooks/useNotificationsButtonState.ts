import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { isTransferInProgress } from '@core/types';
import { useTransferTrackingContext } from '@core/ui';

import { useNextUnifiedBridgeContext } from '@/pages/Bridge/contexts';
import { useUnreadNotificationsCount } from '@/hooks/useUnreadNotificationsCount';

export const useNotificationsButtonState = () => {
  const {
    state: { pendingTransfers },
  } = useNextUnifiedBridgeContext();
  const location = useLocation();
  const { transfers } = useTransferTrackingContext();
  const isWalletView = location.pathname.startsWith('/wallet');

  const hasPendingLegacyBridgeTransfers = useMemo(
    () => (isWalletView ? false : Object.values(pendingTransfers).length > 0),
    [pendingTransfers, isWalletView],
  );

  const hasPendingTransfers = useMemo(
    () =>
      Object.values(transfers).some(({ transfer }) =>
        isTransferInProgress(transfer),
      ),
    [transfers],
  );
  const hasUnreadTransfers = useMemo(
    () => Object.values(transfers).some(({ isRead }) => !isRead),
    [transfers],
  );

  const unreadCount = useUnreadNotificationsCount();
  const showActiveIcon = hasPendingTransfers || hasPendingLegacyBridgeTransfers;
  const showNotificationsBadge =
    !showActiveIcon && (unreadCount > 0 || hasUnreadTransfers);

  return {
    showActiveIcon: hasPendingTransfers || hasPendingLegacyBridgeTransfers,
    showUnreadBadge: showNotificationsBadge,
  };
};
