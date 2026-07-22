import {
  EercOperation,
  parseEercTransaction,
  TransactionParams,
} from '@avalabs/evm-module';
import { RpcMethod, RpcRequest } from '@avalabs/vm-module-types';

import {
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';
import { measureDuration } from '@core/common';

type AnalyticsEventBuilderFn = (
  event: ExtensionConnectionEvent<TransactionStatusInfo>,
) => Promise<{ name: string; properties: Record<string, unknown> } | null>;

type TransactionStatusEventBuilders = Partial<
  Record<TransactionStatusEvents, AnalyticsEventBuilderFn>
>;

type EthSendTransactionRequest = RpcRequest & {
  method: RpcMethod.ETH_SEND_TRANSACTION;
  params: [TransactionParams];
};

type PrivacyData = {
  type: 'eerc20';
  operation: EercOperation;
};

export function getEthSendTransactionHandlers(): TransactionStatusEventBuilders {
  return {
    [TransactionStatusEvents.PENDING]: async (event) => {
      if (!isEthSendTransactionRequest(event.value.request)) {
        return null;
      }

      const { txHash, request } = event.value;

      measureDuration(txHash).start();

      return {
        name: 'eth_sendTransaction_success',
        properties: {
          dAppUrl: request.dappInfo.url,
          address: request.params[0].from,
          txHash,
          chainId: request.chainId,
          privacy: getPrivacyData(request),
        },
      };
    },
    [TransactionStatusEvents.REVERTED]: async (event) => {
      if (!isEthSendTransactionRequest(event.value.request)) {
        return null;
      }

      const { txHash, request } = event.value;

      measureDuration(txHash).end(); // Just stop the timer, we don't log the duration for reverts.

      return {
        name: 'eth_sendTransaction_failed',
        properties: {
          dAppUrl: request.dappInfo.url,
          address: request.params[0].from,
          txHash,
          chainId: request.chainId,
          privacy: getPrivacyData(request),
        },
      };
    },
    [TransactionStatusEvents.CONFIRMED]: async (event) => {
      if (!isEthSendTransactionRequest(event.value.request)) {
        return null;
      }

      const { txHash, request } = event.value;
      const duration = measureDuration(txHash).end();

      return {
        name: 'eth_sendTransaction_confirmed',
        properties: {
          dAppUrl: request.dappInfo.url,
          address: request.params[0].from,
          txHash,
          chainId: request.chainId,
          duration,
          privacy: getPrivacyData(request),
        },
      };
    },
  };
}

const isEthSendTransactionRequest = (
  request: RpcRequest,
): request is EthSendTransactionRequest => {
  return (
    request.method === RpcMethod.ETH_SEND_TRANSACTION &&
    Array.isArray(request.params) &&
    request.params.length === 1
  );
};

const getPrivacyData = (
  request: EthSendTransactionRequest,
): PrivacyData | undefined => {
  const { operation } = parseEercTransaction(request.params[0]) ?? {};
  return operation ? { type: 'eerc20', operation } : undefined;
};
