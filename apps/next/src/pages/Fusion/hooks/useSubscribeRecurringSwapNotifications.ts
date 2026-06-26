import { useEffect, useRef } from 'react';

import { useConnectionContext } from '@core/ui';
import { ExtensionRequest } from '@core/types';
import { Monitoring } from '@core/common';
import type { SubscribeToRecurringSwapNotifications } from '@core/service-worker';

/**
 * Registers the device for push updates on the given recurring swap orders.
 * Subscriptions are gated by the Balance changes preference in the service
 * worker; this hook just forwards the active order ids whenever they change.
 */
export const useSubscribeRecurringSwapNotifications = (orderIds: string[]) => {
  const { request } = useConnectionContext();
  const lastSentKey = useRef<string>('');

  useEffect(() => {
    if (!orderIds.length) {
      return;
    }

    const key = [...orderIds].sort().join(',');
    if (key === lastSentKey.current) {
      return;
    }
    lastSentKey.current = key;

    request<SubscribeToRecurringSwapNotifications>({
      method: ExtensionRequest.NOTIFICATION_SUBSCRIBE_RECURRING_SWAPS,
      params: [orderIds],
    }).catch((err) => {
      lastSentKey.current = '';
      Monitoring.sentryCaptureException(
        err as Error,
        Monitoring.SentryExceptionTypes.NOTIFICATIONS,
      );
    });
  }, [orderIds, request]);
};
