import { PropsWithChildren, ReactNode, useCallback, useEffect } from 'react';
import { toast } from '@avalabs/k2-alpine';
import { filter } from 'rxjs';
import { useTranslation } from 'react-i18next';

import {
  ContextContainer,
  ExtensionConnectionEvent,
  NetworkWithCaipId,
  SwapErrorCode,
  TransactionStatusEvents as TransactionStatusEventNames,
  TransactionStatusInfo,
} from '@core/types';
import type { RpcRequest } from '@avalabs/vm-module-types';
import { useConnectionContext } from '../ConnectionProvider';
import { useNetworkContext } from '../NetworkProvider';
import { isTransactionStatusEvent } from './isTransactionStatusEvent';
import { isSpecificContextContainer } from '../../utils';
import { isAvalanchePrimaryNetwork } from '@core/common';

const PENDING_TOAST_ID = 'transaction-pending';
const SUCCESS_TOAST_ID = 'transaction-success';
const FAILURE_TOAST_ID = 'transaction-failure';

export type TransactionStatusCallbackParams = {
  network?: NetworkWithCaipId;
  context?: RpcRequest['context'];
};

/**
 * If the network is C/X/P chain, we show a success toast immediately when the transaction is pending.
 * For other networks, we show a pending toast and show the success toast when the transaction is confirmed.
 */
export type TransactionStatusProviderProps = PropsWithChildren<{
  renderExplorerLink?: (options: {
    network: NetworkWithCaipId;
    hash: string;
    onDismiss: () => void;
  }) => ReactNode;
  onPending?: (params: TransactionStatusCallbackParams) => void;
  onSuccess?: (params: TransactionStatusCallbackParams) => void;
  onReverted?: (params: TransactionStatusCallbackParams) => void;
}>;

const allowedContexts = [ContextContainer.POPUP, ContextContainer.SIDE_PANEL];

// Only subscribe to transaction events in the floating popup and the side panel view.
// Otherwise we might show a toast in the wrong context, for example on the approval pages.
const isAllowedContext = () => {
  return allowedContexts.some(isSpecificContextContainer);
};

export function TransactionStatusProvider({
  children,
  renderExplorerLink,
  onPending,
  onSuccess,
  onReverted,
}: TransactionStatusProviderProps) {
  const { events } = useConnectionContext();
  const { getNetwork } = useNetworkContext();
  const { t } = useTranslation();

  const getExplorerLink = useCallback(
    (hash: string, network?: NetworkWithCaipId) => {
      return network && renderExplorerLink
        ? renderExplorerLink({
            network,
            hash,
            onDismiss: () => {
              toast.dismiss(`${SUCCESS_TOAST_ID}-${hash}`);
            },
          })
        : undefined;
    },
    [renderExplorerLink],
  );

  useEffect(() => {
    if (!isAllowedContext()) {
      return;
    }

    const subscription = events()
      .pipe(filter(isTransactionStatusEvent))
      .subscribe((evt: ExtensionConnectionEvent<TransactionStatusInfo>) => {
        const { txHash, request } = evt.value;
        const { context } = request;
        const network = getNetwork(request.chainId);

        if (txHash) {
          switch (evt.name) {
            case TransactionStatusEventNames.PENDING: {
              // Skip pending toast for intermediate transactions or bridge transactions
              // (e.g., ERC-20 spend approvals before swaps/bridges)
              if (
                context?.surpressSuccessToast ||
                context?.isIntermediateTransaction ||
                context?.isBridge
              ) {
                break;
              }

              onPending?.({ network, context });

              if (isAvalanchePrimaryNetwork(network)) {
                const explorerLink = getExplorerLink(txHash, network);
                toast.success(t('Transaction successful'), {
                  id: `${SUCCESS_TOAST_ID}-${txHash}`,
                  ...(explorerLink && { action: explorerLink }),
                });
              } else {
                toast.pending(t('Transaction pending...'), {
                  id: `${PENDING_TOAST_ID}-${txHash}`,
                });
              }

              break;
            }

            case TransactionStatusEventNames.CONFIRMED: {
              // Skip success callback and toast for intermediate transactions
              // For bridge transactions, we take the user to the bridge transaction status page instead
              // (e.g., ERC-20 spend approvals before swaps/bridges)
              // Skip success callback and toast for Avalanche primary networks since we show a success toast in the pending callback
              if (
                context?.surpressSuccessToast ||
                context?.isIntermediateTransaction ||
                context?.isBridge ||
                isAvalanchePrimaryNetwork(network)
              ) {
                break;
              }

              toast.dismiss(`${PENDING_TOAST_ID}-${txHash}`);

              const explorerLink = getExplorerLink(txHash, network);
              onSuccess?.({ network, context });
              toast.success(t('Transaction successful'), {
                id: `${SUCCESS_TOAST_ID}-${txHash}`,
                ...(explorerLink && { action: explorerLink }),
              });
              break;
            }

            case TransactionStatusEventNames.REVERTED: {
              toast.dismiss(`${PENDING_TOAST_ID}-${txHash}`);
              toast.dismiss(`${SUCCESS_TOAST_ID}-${txHash}`); // Success toast may be shown optimistically for X/C/P chains.
              onReverted?.({ network, context });

              const message =
                context?.revertReason ===
                SwapErrorCode.TransactionRevertedDueToSlippage
                  ? t('Transaction failed due to slippage')
                  : t('Transaction failed');

              toast.error(message, {
                id: `${FAILURE_TOAST_ID}-${txHash}`,
              });
              break;
            }
          }
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [
    events,
    getNetwork,
    t,
    renderExplorerLink,
    onPending,
    onSuccess,
    onReverted,
    getExplorerLink,
  ]);

  return <>{children}</>;
}
