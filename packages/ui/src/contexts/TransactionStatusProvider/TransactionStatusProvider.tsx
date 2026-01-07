import { PropsWithChildren, ReactNode, useEffect } from 'react';
import { type toast } from '@avalabs/k2-alpine';
import { filter } from 'rxjs';
import { useTranslation } from 'react-i18next';

import {
  ContextContainer,
  ExtensionConnectionEvent,
  NetworkWithCaipId,
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import { useConnectionContext } from '../ConnectionProvider';
import { useNetworkContext } from '../NetworkProvider';
import { isTransactionStatusEvent } from './isTransactionStatusEvent';
import { isSpecificContextContainer } from '../../utils';

const PENDING_TOAST_ID = 'transaction-pending';
const RESULT_TOAST_ID = 'transaction-result';

export type TransactionStatusProviderProps = PropsWithChildren<{
  toast: typeof toast;
  renderExplorerLink?: (options: {
    network: NetworkWithCaipId;
    hash: string;
    onDismiss: () => void;
  }) => ReactNode;
  onPending?: () => void;
  onSuccess?: (context?: TransactionStatusInfo['context']) => void;
  onReverted?: () => void;
}>;

const allowedContexts = [ContextContainer.POPUP, ContextContainer.SIDE_PANEL];

// Only subscribe to transaction events in the floating popup and the side panel view.
// Otherwise we might show a toast in the wrong context, for example on the approval pages.
const isAllowedContext = () => {
  return allowedContexts.some(isSpecificContextContainer);
};

export function TransactionStatusProvider({
  children,
  toast,
  renderExplorerLink,
  onPending,
  onSuccess,
}: TransactionStatusProviderProps) {
  const { events } = useConnectionContext();
  const { getNetwork } = useNetworkContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isAllowedContext()) {
      return;
    }

    const subscription = events()
      .pipe(filter(isTransactionStatusEvent))
      .subscribe((evt: ExtensionConnectionEvent<TransactionStatusInfo>) => {
        const statusInfo = evt.value;
        const network = getNetwork(statusInfo.chainId);

        if (statusInfo.txHash) {
          switch (evt.name) {
            case TransactionStatusEventNames.PENDING: {
              // Skip pending toast for intermediate transactions or bridge transactions
              // (e.g., ERC-20 spend approvals before swaps/bridges)
              if (
                statusInfo.context?.isIntermediateTransaction ||
                statusInfo.context?.isBridge
              ) {
                break;
              }

              onPending?.();
              toast.pending(t('Transaction pending...'), {
                id: `${PENDING_TOAST_ID}-${statusInfo.txHash}`,
              });
              break;
            }

            case TransactionStatusEventNames.CONFIRMED: {
              toast.dismiss(`${PENDING_TOAST_ID}-${statusInfo.txHash}`);

              // Skip success callback and toast for intermediate transactions
              // For bridge transactions, we take the user to the bridge transaction status page instead
              // (e.g., ERC-20 spend approvals before swaps/bridges)
              if (
                statusInfo.context?.isIntermediateTransaction ||
                statusInfo.context?.isBridge
              ) {
                break;
              }

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
  }, [events, getNetwork, t, toast, renderExplorerLink, onPending, onSuccess]);

  return <>{children}</>;
}
