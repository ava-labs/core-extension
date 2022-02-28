import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { BridgeState } from '../models';
import { BridgeEvents } from './models';

export function bridgeTransactionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<BridgeState>
) {
  return evt.name === BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED;
}
