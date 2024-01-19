import { ExtensionConnectionEvent } from '@src/background/connections/models';
import {
  UnifiedBridgeAssetsUpdated,
  UnifiedBridgeEvent,
  UnifiedBridgeStateUpdateEvent,
  UnifiedBridgeTransferStepChangeEvent,
} from '../models';

export const isUnifiedBridgeStateUpdate = (
  ev: ExtensionConnectionEvent
): ev is UnifiedBridgeStateUpdateEvent =>
  ev.name === UnifiedBridgeEvent.StateUpdated;

export const isUnifiedBridgeTransferStepChanged = (
  ev: ExtensionConnectionEvent
): ev is UnifiedBridgeTransferStepChangeEvent =>
  ev.name === UnifiedBridgeEvent.TransferStepChange;

export const isUnifiedBridgeAssetsUpdatedEvent = (
  ev: ExtensionConnectionEvent
): ev is UnifiedBridgeAssetsUpdated =>
  ev.name === UnifiedBridgeEvent.AssetsUpdated;
