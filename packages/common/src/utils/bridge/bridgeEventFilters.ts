import {
  ExtensionConnectionEvent,
  UnifiedBridgeEvent,
  UnifiedBridgeStateUpdateEvent,
  UnifiedBridgeTransferStepChangeEvent,
  BridgeEvents,
  BridgeState,
  TransferEvent,
} from '@core/types';
import { BridgeConfig } from '@avalabs/core-bridge-sdk';

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

export const isUnifiedBridgeStateUpdate = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeStateUpdateEvent =>
  ev.name === UnifiedBridgeEvent.StateUpdated;

export const isUnifiedBridgeTransferStepChanged = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeTransferStepChangeEvent =>
  ev.name === UnifiedBridgeEvent.TransferStepChange;
