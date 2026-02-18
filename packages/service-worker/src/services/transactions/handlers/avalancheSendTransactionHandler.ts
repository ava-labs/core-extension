import {
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

import { measureDuration } from '@core/common';

type AnalyticsEventBuilderFn = (
  event: ExtensionConnectionEvent<TransactionStatusInfo>,
) => { name: string; properties: Record<string, unknown> } | null;

export type TransactionStatusEventBuilders = Partial<
  Record<TransactionStatusEvents, AnalyticsEventBuilderFn>
>;

export const AvalancheSendTransactionHandlers: TransactionStatusEventBuilders =
  {
    [TransactionStatusEvents.PENDING]: (event) => {
      const { txHash, chainId, accountAddress } = event.value;

      measureDuration(txHash).start();

      return {
        name: 'avalanche_sendTransaction_success',
        properties: { address: accountAddress, txHash, chainId },
      };
    },
    [TransactionStatusEvents.REVERTED]: (event) => {
      const { txHash, chainId, accountAddress } = event.value;

      measureDuration(txHash).end();

      return {
        name: 'avalanche_sendTransaction_failed',
        properties: { address: accountAddress, txHash, chainId },
      };
    },
    [TransactionStatusEvents.CONFIRMED]: (event) => {
      const { txHash, chainId, accountAddress } = event.value;
      const duration = measureDuration(txHash).end();

      return {
        name: 'avalanche_sendTransaction_confirmed',
        properties: { address: accountAddress, txHash, chainId, duration },
      };
    },
  };
