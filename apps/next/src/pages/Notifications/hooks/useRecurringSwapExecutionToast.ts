import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from '@core/ui';
import { isRecurringSwapNotification } from '@core/types';

import { getRecurringSwapCopy } from '../lib/getRecurringSwapCopy';

import { useNotificationCenterList } from './useNotificationCenterList';

export const useRecurringSwapExecutionToast = () => {
  const { t } = useTranslation();
  const { data: notifications } = useNotificationCenterList();
  // Baseline so historical notifications loaded on mount don't replay as toasts.
  const mountedAtRef = useRef(Date.now());
  const toastedIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!notifications) {
      return;
    }

    for (const notification of notifications) {
      if (
        !isRecurringSwapNotification(notification) ||
        notification.timestamp < mountedAtRef.current ||
        toastedIdsRef.current.has(notification.id)
      ) {
        continue;
      }
      toastedIdsRef.current.add(notification.id);

      const { title, body } = getRecurringSwapCopy(notification, t);

      if (notification.data?.status?.toLowerCase() === 'failed') {
        toast.error(title, { description: body });
      } else {
        toast.success(title, { description: body });
      }
    }
  }, [notifications, t]);
};
