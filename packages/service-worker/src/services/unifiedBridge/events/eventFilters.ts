import { ExtensionConnectionEvent } from '../../../connections/models';
import {
  UnifiedBridgeEvent,
  UnifiedBridgeStateUpdateEvent,
  UnifiedBridgeTransferStepChangeEvent,
} from '@core/types/src/models';

export const isUnifiedBridgeStateUpdate = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeStateUpdateEvent =>
  ev.name === UnifiedBridgeEvent.StateUpdated;

export const isUnifiedBridgeTransferStepChanged = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeTransferStepChangeEvent =>
  ev.name === UnifiedBridgeEvent.TransferStepChange;
