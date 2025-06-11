import {
  ExtensionConnectionEvent,
  LedgerDeviceRequestData,
  LedgerEvent,
} from '@core/types';

export function ledgerDiscoverTransportsEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<{ name: LedgerEvent.DISCOVER_TRANSPORTS }> {
  return evt.name === LedgerEvent.DISCOVER_TRANSPORTS;
}

export function isLedgerDeviceRequestEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<LedgerDeviceRequestData> {
  return evt.name === LedgerEvent.TRANSPORT_REQUEST;
}
