import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Transfer } from '@avalabs/unified-asset-transfer';

import {
  TrackUnifiedTransfer,
  TransferTrackingGetState,
} from '@core/service-worker';
import { ExtensionRequest } from '@core/types';

import { useConnectionContext } from '../ConnectionProvider';
import { isTransfersUpdatedEvent } from './listeners/isTransfersUpdatedEvent';
import { filter, map } from 'rxjs';

type TransferTrackingState = {
  isLoading: boolean;
  transfers: Transfer[];
  trackTransfer(transfer: Transfer): void;
};

const TransferTrackingContext = createContext<
  TransferTrackingState | undefined
>(undefined);

export function TransferTrackingContextProvider({
  children,
}: PropsWithChildren) {
  const { events, request } = useConnectionContext();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('TransferTrackingContextProvider');
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

  return (
    <TransferTrackingContext.Provider
      value={{
        transfers,
        isLoading,
        trackTransfer,
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
