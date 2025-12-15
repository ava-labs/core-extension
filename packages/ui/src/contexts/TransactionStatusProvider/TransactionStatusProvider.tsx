import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { filter } from 'rxjs';
import { useTranslation } from 'react-i18next';

import {
  ExtensionConnectionEvent,
  NetworkWithCaipId,
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { useConnectionContext } from '../ConnectionProvider';
import { useNetworkContext } from '../NetworkProvider';
import { isTransactionStatusEvent } from './isTransactionStatusEvent';

const PENDING_TOAST_ID = 'transaction-pending';
const RESULT_TOAST_ID = 'transaction-result';

export type ToastFunctions = {
  pending: (message: string, options?: { id?: string }) => void;
  success: (
    message: string,
    options?: { id?: string; action?: ReactNode },
  ) => void;
  error: (message: string, options?: { id?: string }) => void;
  dismiss: (id: string) => void;
};

export type TransactionStatusProviderProps = PropsWithChildren<{
  toast: ToastFunctions;
  renderExplorerLink?: (options: {
    network: NetworkWithCaipId;
    hash: string;
    onDismiss: () => void;
  }) => ReactNode;
  onPending?: () => void;
  onSuccess?: () => void;
  onReverted?: () => void;
}>;

export function TransactionStatusProvider({
  children,
  toast,
  renderExplorerLink,
  onSuccess,
}: TransactionStatusProviderProps) {
  const { events } = useConnectionContext();
  const { getNetwork } = useNetworkContext();
  const { t } = useTranslation();

  useEffect(() => {
    const subscription = events()
      .pipe(filter(isTransactionStatusEvent))
      .subscribe((evt: ExtensionConnectionEvent<TransactionStatusInfo>) => {
        const statusInfo = evt.value;
        const network = getNetwork(statusInfo.chainId);

        if (statusInfo.txHash) {
          switch (evt.name) {
            case TransactionStatusEventNames.PENDING: {
              toast.pending(t('Transaction pending...'), {
                id: `${PENDING_TOAST_ID}-${statusInfo.txHash}`,
              });
              break;
            }

            case TransactionStatusEventNames.CONFIRMED: {
              toast.dismiss(`${PENDING_TOAST_ID}-${statusInfo.txHash}`);
              const explorerLink =
                network && renderExplorerLink
                  ? renderExplorerLink({
                      network,
                      hash: statusInfo.txHash,
                      onDismiss: () => {
                        toast.dismiss(
                          `${RESULT_TOAST_ID}-${statusInfo.txHash}`,
                        );
                      },
                    })
                  : undefined;
              onSuccess?.();
              toast.success(t('Transaction successful'), {
                id: `${RESULT_TOAST_ID}-${statusInfo.txHash}`,
                ...(explorerLink && { action: explorerLink }),
              });
              break;
            }

            case TransactionStatusEventNames.REVERTED: {
              toast.dismiss(`${PENDING_TOAST_ID}-${statusInfo.txHash}`);
              toast.error(t('Transaction failed'), {
                id: `${RESULT_TOAST_ID}-${statusInfo.txHash}`,
              });
              break;
            }
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [events, getNetwork, t, toast, renderExplorerLink, onSuccess]);

  return <>{children}</>;
}
