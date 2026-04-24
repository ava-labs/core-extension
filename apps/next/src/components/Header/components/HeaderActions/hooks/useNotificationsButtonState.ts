import { useMemo } from 'react';

import { isTransferInProgress } from '@core/types';
import { useTransferTrackingContext } from '@core/ui';

import { useUnreadNotificationsCount } from '@/hooks/useUnreadNotificationsCount';

export const useNotificationsButtonState = () => {
  const { transfers } = useTransferTrackingContext();

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
  const showActiveIcon = hasPendingTransfers;
  const showNotificationsBadge =
    !showActiveIcon && (unreadCount > 0 || hasUnreadTransfers);

  return {
    showActiveIcon: hasPendingTransfers,
    showUnreadBadge: showNotificationsBadge,
  };
};
