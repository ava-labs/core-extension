import { ExtensionConnectionEvent } from '../../../connections/models';
import { LedgerEvent } from '@core/types';

export function ledgerDiscoverTransportsEventListener(
  evt: ExtensionConnectionEvent,
) {
  return evt.name === LedgerEvent.DISCOVER_TRANSPORTS;
}
