import { BridgeConfig } from '@avalabs/bridge-sdk';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { BridgeEvents, BridgeState, TransferEvent } from '../models';

export function bridgeTransactionsUpdatedEventListener(
  evt: ExtensionConnectionEvent<BridgeState>
) {
  return evt.name === BridgeEvents.BRIDGE_TRANSACTIONS_UPDATED;
}

export function isBridgeConfigUpdateEventListener(
  evt: ExtensionConnectionEvent<BridgeConfig>
) {
  return evt?.name === BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT;
}

export function isBridgeTransferEventListener(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<TransferEvent> {
  return evt?.name === BridgeEvents.BRIDGE_TRANSFER_EVENT;
}
