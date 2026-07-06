import type { TFunction } from 'i18next';
import { RECURRING_UNLIMITED_ORDERS_SENTINEL } from '@avalabs/fusion-sdk';

import type { RecurringSwapOrder } from '../hooks/useRecurringSwapOrders';

import { getFrequencyUnitLabelInline } from './formatFrequency';

export const isUnlimitedRecurringOrder = (
  order: Pick<RecurringSwapOrder, 'ordersTotal'>,
): boolean =>
  order.ordersTotal === RECURRING_UNLIMITED_ORDERS_SENTINEL ||
  order.ordersTotal <= 0;

export const getRecurringOrderScheduleLabel = (
  order: RecurringSwapOrder,
  t: TFunction,
): string => {
  const interval = getFrequencyUnitLabelInline(
    order.frequencyUnit,
    order.frequencyQuantity,
    t,
  );

  if (isUnlimitedRecurringOrder(order)) {
    return t('Every {{quantity}} {{unit}} · No end date', {
      quantity: order.frequencyQuantity,
      unit: interval,
    });
  }

  return t('Every {{quantity}} {{unit}} · {{count}} orders total', {
    quantity: order.frequencyQuantity,
    unit: interval,
    count: order.ordersTotal,
  });
};

export const getRecurringOrderExecutedLabel = (
  order: RecurringSwapOrder,
  t: TFunction,
): string =>
  isUnlimitedRecurringOrder(order)
    ? t('{{executed}} completed', { executed: order.ordersExecuted })
    : t('{{executed}} of {{total}}', {
        executed: order.ordersExecuted,
        total: order.ordersTotal,
      });
