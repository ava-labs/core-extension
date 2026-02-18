import { RpcMethod } from '@avalabs/vm-module-types';
import {
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

import type { AnalyticsServicePosthog } from '../../analytics/AnalyticsServicePosthog';
import { measureDuration } from '@core/common';

const PENDING_EVENT_NAME = 'avalanche_sendTransaction_success';
const REVERTED_EVENT_NAME = 'avalanche_sendTransaction_failed';
const CONFIRMED_EVENT_NAME = 'avalanche_sendTransaction_confirmed';

export type AvalancheSendTransactionHandlerContext = {
  analyticsServicePosthog: AnalyticsServicePosthog;
  event: ExtensionConnectionEvent<TransactionStatusInfo>;
};

export async function avalancheSendTransactionHandler({
  analyticsServicePosthog,
  event,
}: AvalancheSendTransactionHandlerContext) {
  const { value } = event;
  if (!value) {
    return;
  }
  const method = value.method;
  if (method !== RpcMethod.AVALANCHE_SEND_TRANSACTION) {
    return;
  }

  const accountAddress = value.accountAddress;
  if (!accountAddress) {
    return;
  }

  const { txHash, chainId } = value;

  const eventName =
    event.name === TransactionStatusEvents.PENDING
      ? PENDING_EVENT_NAME
      : event.name === TransactionStatusEvents.REVERTED
        ? REVERTED_EVENT_NAME
        : event.name === TransactionStatusEvents.CONFIRMED
          ? CONFIRMED_EVENT_NAME
          : null;

  if (!eventName) {
    return;
  }

  let properties: Record<string, any> = {
    address: accountAddress,
    txHash,
    chainId,
  };

  if (eventName === PENDING_EVENT_NAME) {
    measureDuration(txHash).start();
  } else if (eventName === REVERTED_EVENT_NAME) {
    measureDuration(txHash).end();
  } else if (eventName === CONFIRMED_EVENT_NAME) {
    const duration = measureDuration(txHash).end();
    properties = {
      address: accountAddress,
      txHash,
      chainId,
      duration,
    };
  }

  analyticsServicePosthog.captureEncryptedEvent({
    name: eventName,
    windowId: crypto.randomUUID(),
    properties,
  });
}
