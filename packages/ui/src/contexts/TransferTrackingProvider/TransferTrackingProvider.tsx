import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Transfer } from '@avalabs/fusion-sdk';

import {
  ClearHistoricalTransfers,
  MarkTransferAsRead,
  TrackUnifiedTransfer,
  TransferTrackingGetState,
} from '@core/service-worker';
import { ExtensionRequest, TrackedTransfer } from '@core/types';

import { useConnectionContext } from '../ConnectionProvider';
import { isTransfersUpdatedEvent } from './listeners/isTransfersUpdatedEvent';
import { filter, map } from 'rxjs';

type TransferTrackingState = {
  isLoading: boolean;
  transfers: TrackedTransfer[];
  trackTransfer(transfer: Transfer): void;
  markAsRead(transferId: string): void;
  clearHistoricalTransfers(): void;
};

const TransferTrackingContext = createContext<
  TransferTrackingState | undefined
>(undefined);

export function TransferTrackingContextProvider({
  children,
}: PropsWithChildren) {
  const { events, request } = useConnectionContext();
  const [transfers, setTransfers] = useState<TrackedTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    request<TransferTrackingGetState>({
      method: ExtensionRequest.TRANSFER_TRACKING_GET_STATE,
    })
      .then(({ trackedTransfers }) => {
        setTransfers(Object.values(trackedTransfers));
      })
      .finally(() => {
        setIsLoading(false);
      });

    const subscription = events()
      .pipe(
        filter(isTransfersUpdatedEvent),
        map((evt) => evt.value),
      )
      .subscribe((updatedTransfers) => {
        setTransfers(Object.values(updatedTransfers));
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, request]);

  const trackTransfer = useCallback(
    (transfer: Transfer) =>
      request<TrackUnifiedTransfer>({
        method: ExtensionRequest.TRANSFER_TRACKING_TRACK_TRANSFER,
        params: [transfer],
      }),
    [request],
  );

  const markAsRead = useCallback(
    (transferId: string) =>
      request<MarkTransferAsRead>({
        method: ExtensionRequest.TRANSFER_TRACKING_MARK_AS_READ,
        params: [transferId],
      }),
    [request],
  );

  const clearHistoricalTransfers = useCallback(
    () =>
      request<ClearHistoricalTransfers>({
        method: ExtensionRequest.TRANSFER_TRACKING_CLEAR_HISTORICAL_TRANSFERS,
      }).then(({ trackedTransfers }) => {
        setTransfers(Object.values(trackedTransfers));
      }),
    [request],
  );

  return (
    <TransferTrackingContext.Provider
      value={{
        transfers,
        isLoading,
        trackTransfer,
        markAsRead,
        clearHistoricalTransfers,
      }}
    >
      {children}
    </TransferTrackingContext.Provider>
  );
}

export function useTransferTrackingContext() {
  const context = useContext(TransferTrackingContext);

  if (!context) {
    throw new Error(
      'useTransferTrackingContext must be used within a TransferTrackingProvider',
    );
  }

  return context;
}
