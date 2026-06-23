import { useCallback, useEffect, useState } from 'react';
import { RecurringOrderStatus, type RecurringOrder } from '@avalabs/fusion-sdk';

export type RecurringSwapOrderStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export const mapStatus = (
  status: RecurringOrderStatus,
): RecurringSwapOrderStatus => {
  switch (status) {
    case RecurringOrderStatus.Completed:
      return 'completed';
    case RecurringOrderStatus.Cancelled:
      return 'cancelled';
    case RecurringOrderStatus.Paused:
      return 'paused';
    case RecurringOrderStatus.Active:
    default:
      return 'active';
  }
};

type UseOptimisticOrderStatusesResult = {
  optimisticStatusById: Map<string, RecurringSwapOrderStatus>;
  setOptimisticStatus: (id: string, status: RecurringSwapOrderStatus) => void;
};

/**
 * Holds short-lived optimistic status overrides for recurring orders (e.g. show
 * "paused" immediately after the user pauses, before Markr observes the
 * on-chain event). Each override is dropped once the refetched server data
 * reports the same status (or the order is gone) so it can't mask later real
 * status changes — including actions performed from another device/session.
 */
export const useOptimisticOrderStatuses = (
  fetchedOrders: readonly RecurringOrder[],
): UseOptimisticOrderStatusesResult => {
  const [optimisticStatusById, setOptimisticStatusById] = useState<
    Map<string, RecurringSwapOrderStatus>
  >(() => new Map());

  useEffect(() => {
    setOptimisticStatusById((current) => {
      if (current.size === 0) {
        return current;
      }

      const serverStatusById = new Map<string, RecurringSwapOrderStatus>(
        fetchedOrders.map((order) => [order.orderId, mapStatus(order.status)]),
      );

      let changed = false;
      const next = new Map(current);

      for (const [orderId, optimisticStatus] of current) {
        const serverStatus = serverStatusById.get(orderId);
        if (serverStatus === undefined || serverStatus === optimisticStatus) {
          next.delete(orderId);
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [fetchedOrders]);

  const setOptimisticStatus = useCallback(
    (id: string, status: RecurringSwapOrderStatus) => {
      setOptimisticStatusById((current) => new Map(current).set(id, status));
    },
    [],
  );

  return { optimisticStatusById, setOptimisticStatus };
};
