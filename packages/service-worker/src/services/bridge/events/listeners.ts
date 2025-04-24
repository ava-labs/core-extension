import { BridgeConfig } from '@avalabs/core-bridge-sdk';
import { ExtensionConnectionEvent } from '../../../connections/models';
import { BridgeEvents, BridgeState, TransferEvent } from '@core/types/src/models';

export function isBridgeStateUpdateEventListener(
  evt: ExtensionConnectionEvent<BridgeState>,
) {
  return evt.name === BridgeEvents.BRIDGE_STATE_UPDATE_EVENT;
}

export function isBridgeConfigUpdateEventListener(
  evt: ExtensionConnectionEvent<BridgeConfig>,
) {
  return evt?.name === BridgeEvents.BRIDGE_CONFIG_UPDATE_EVENT;
}

export function isBridgeTransferEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<TransferEvent> {
  return evt?.name === BridgeEvents.BRIDGE_TRANSFER_EVENT;
}
