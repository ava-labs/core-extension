import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { LedgerEvent } from '../models';

export function ledgerDiscoverTransportsEventListener(
  evt: ExtensionConnectionEvent,
) {
  return evt.name === LedgerEvent.DISCOVER_TRANSPORTS;
}
