import {
  ExtensionConnectionEvent,
  TransactionStatusEvents,
  TransactionStatusInfo,
} from '@core/types';

export function isTransactionStatusEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<TransactionStatusInfo> {
  return (
    evt.name === TransactionStatusEvents.PENDING ||
    evt.name === TransactionStatusEvents.CONFIRMED ||
    evt.name === TransactionStatusEvents.REVERTED
  );
}
