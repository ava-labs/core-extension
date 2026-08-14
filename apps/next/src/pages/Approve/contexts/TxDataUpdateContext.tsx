import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type TxDataUpdateContextValue = {
  /**
   * True while at least one descendant has a pending tx-data update
   * (either an in-flight `ACTION_UPDATE_TX_DATA` request, or a known-pending
   * initial update that hasn't been dispatched yet).
   *
   * Approval screens use this to keep the Approve button disabled so the user
   * cannot submit the action with stale signing data.
   */
  isUpdating: boolean;
  /**
   * Wraps an async tx-data update so the provider can count it as in-flight
   * until it settles.
   */
  trackTxDataUpdate: <T>(promise: Promise<T>) => Promise<T>;
  /**
   * Marks the context as "updating" until the returned cleanup runs. Useful
   * when a hook knows on mount that an update will be dispatched on a later
   * render, before any promise actually exists to track.
   */
  registerPendingTxDataUpdate: () => () => void;
};

const TxDataUpdateContext = createContext<TxDataUpdateContextValue | null>(
  null,
);

export const TxDataUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [pendingCount, setPendingCount] = useState(0);

  const increment = useCallback(() => {
    setPendingCount((count) => count + 1);
  }, []);

  const decrement = useCallback(() => {
    setPendingCount((count) => Math.max(0, count - 1));
  }, []);

  const trackTxDataUpdate = useCallback(
    <T,>(promise: Promise<T>): Promise<T> => {
      increment();
      return promise.finally(decrement);
    },
    [increment, decrement],
  );

  const registerPendingTxDataUpdate = useCallback(() => {
    increment();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      decrement();
    };
  }, [increment, decrement]);

  const value = useMemo<TxDataUpdateContextValue>(
    () => ({
      isUpdating: pendingCount > 0,
      trackTxDataUpdate,
      registerPendingTxDataUpdate,
    }),
    [pendingCount, trackTxDataUpdate, registerPendingTxDataUpdate],
  );

  return (
    <TxDataUpdateContext.Provider value={value}>
      {children}
    </TxDataUpdateContext.Provider>
  );
};

export const useTxDataUpdate = (): TxDataUpdateContextValue => {
  const context = useContext(TxDataUpdateContext);

  if (!context) {
    throw new Error(
      'useTxDataUpdate must be used within a TxDataUpdateProvider',
    );
  }

  return context;
};

/**
 * Marks the context as "updating" for as long as `isPending` is true.
 * Use this when a hook can already tell during render that an update is
 * required but the actual request hasn't been dispatched yet (e.g. waiting
 * for a dependency to load).
 */
export const usePendingTxDataUpdate = (isPending: boolean) => {
  const { registerPendingTxDataUpdate } = useTxDataUpdate();

  useEffect(() => {
    if (!isPending) return;
    return registerPendingTxDataUpdate();
  }, [isPending, registerPendingTxDataUpdate]);
};
