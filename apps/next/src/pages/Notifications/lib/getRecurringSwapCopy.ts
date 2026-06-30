import { TFunction } from 'i18next';
import { AppNotification } from '@core/types';

type RecurringSwapNotification = Extract<
  AppNotification,
  { type: 'RECURRING_SWAP' }
>;

export type RecurringSwapCopy = {
  title: string;
  body: string;
};

// Failure reason codes emitted by the Core notification sender service on
// `failed` updates. Mirrors `RECURRING_SWAP_REASON_CODE_LABELS` in
// core-notification-sender-service; any other code uses the generic copy.
const REASON_CODE_INSUFFICIENT_BALANCE = 2;
const REASON_CODE_INSUFFICIENT_ALLOWANCE = 3;

const getFailedBody = (
  reasonCode: number | undefined,
  t: TFunction,
): string => {
  if (reasonCode === REASON_CODE_INSUFFICIENT_BALANCE) {
    return t('Insufficient balance. Remaining swaps have been cancelled');
  }

  if (reasonCode === REASON_CODE_INSUFFICIENT_ALLOWANCE) {
    return t('Insufficient allowance. Remaining swaps have been cancelled');
  }

  return t('Your recurring swap failed. Remaining swaps have been cancelled');
};

export const getRecurringSwapCopy = (
  notification: RecurringSwapNotification,
  t: TFunction,
): RecurringSwapCopy => {
  const status = notification.data?.status?.toLowerCase();

  if (status === 'completed') {
    return {
      title: t('Recurring swap completed'),
      body: t('Final transaction of your recurring order has been completed.'),
    };
  }

  if (status === 'failed') {
    return {
      title: t('Recurring swap failed'),
      body: getFailedBody(notification.data?.reasonCode, t),
    };
  }

  return {
    title: notification.title,
    body: notification.body,
  };
};
