import { useEffect, useSyncExternalStore } from 'react';
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

// Module-level store, shared across every `useRecurringSwapOrders` instance
// (orders page, swap-screen count, activity tab).
let optimisticStatusById = new Map<string, RecurringSwapOrderStatus>();
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => optimisticStatusById;

const setOptimisticStatus = (id: string, status: RecurringSwapOrderStatus) => {
  optimisticStatusById = new Map(optimisticStatusById).set(id, status);
  emit();
};

// Drops the optimistic override once the refetched server data catches up.
const reconcile = (fetchedOrders: readonly RecurringOrder[]) => {
  if (optimisticStatusById.size === 0) {
    return;
  }

  const serverStatusById = new Map<string, RecurringSwapOrderStatus>(
    fetchedOrders.map((order) => [order.orderId, mapStatus(order.status)]),
  );

  let changed = false;
  const next = new Map(optimisticStatusById);

  for (const [orderId, optimisticStatus] of optimisticStatusById) {
    const serverStatus = serverStatusById.get(orderId);
    if (serverStatus === undefined || serverStatus === optimisticStatus) {
      next.delete(orderId);
      changed = true;
    }
  }

  if (changed) {
    optimisticStatusById = next;
    emit();
  }
};

type UseOptimisticOrderStatusesResult = {
  optimisticStatusById: Map<string, RecurringSwapOrderStatus>;
  setOptimisticStatus: (id: string, status: RecurringSwapOrderStatus) => void;
};

/**
 * Holds short-lived optimistic status overrides for recurring orders (e.g. show
 * "paused"/"cancelled" immediately after the user acts, before Markr observes
 * the on-chain event), shared across all consumers via a module-level store.
 */
export const useOptimisticOrderStatuses = (
  fetchedOrders: readonly RecurringOrder[],
): UseOptimisticOrderStatusesResult => {
  const statusById = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    reconcile(fetchedOrders);
  }, [fetchedOrders]);

  return { optimisticStatusById: statusById, setOptimisticStatus };
};
