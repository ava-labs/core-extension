import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from '@core/ui';
import { isRecurringSwapNotification } from '@core/types';

import { getRecurringSwapCopy } from '../lib/getRecurringSwapCopy';

import { useNotificationCenterList } from './useNotificationCenterList';

// Any real epoch timestamp in seconds (~1.7e9) is well below this, while any in
// milliseconds (~1.7e12) is above it, so it cleanly disambiguates the two.
const SECONDS_TO_MS_THRESHOLD = 1e12;

// Always normalize to milliseconds in case the backend's `createdAt` comes in seconds
// instead of milliseconds for whatever reason.
const toMilliseconds = (timestamp: number): number =>
  timestamp < SECONDS_TO_MS_THRESHOLD ? timestamp * 1000 : timestamp;

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
        toMilliseconds(notification.timestamp) < mountedAtRef.current ||
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
