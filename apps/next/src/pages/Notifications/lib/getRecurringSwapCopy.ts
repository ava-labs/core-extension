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

const getSuccessBody = (
  notification: RecurringSwapNotification,
  t: TFunction,
): string => {
  const { executedOrders, remainingOrders, tokenInSymbol, tokenOutSymbol } =
    notification.data ?? {};

  // Fall back to the backend-provided body when the metadata is incomplete.
  if (
    executedOrders === undefined ||
    remainingOrders === undefined ||
    !tokenInSymbol ||
    !tokenOutSymbol
  ) {
    return notification.body;
  }

  return t(
    'Swap {{index}} of {{fromTokenSymbol}} to {{toTokenSymbol}} complete - {{remaining}} scheduled swaps remaining',
    {
      index: executedOrders,
      fromTokenSymbol: tokenInSymbol,
      toTokenSymbol: tokenOutSymbol,
      remaining: remainingOrders,
    },
  );
};

export const getRecurringSwapCopy = (
  notification: RecurringSwapNotification,
  t: TFunction,
): RecurringSwapCopy => {
  const status = notification.data?.status?.toLowerCase();

  if (status === 'failed') {
    return {
      title: t('Recurring swap failed'),
      body: getFailedBody(notification.data?.reasonCode, t),
    };
  }

  return {
    title: t('Recurring swap executed'),
    body: getSuccessBody(notification, t),
  };
};
