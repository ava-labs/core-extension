import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type {
  UnifiedBridgeStateUpdateEvent,
  UnifiedBridgeTransferStepChangeEvent,
} from '../models';
import { UnifiedBridgeEvent } from '../models';

export const isUnifiedBridgeStateUpdate = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeStateUpdateEvent =>
  ev.name === UnifiedBridgeEvent.StateUpdated;

export const isUnifiedBridgeTransferStepChanged = (
  ev: ExtensionConnectionEvent,
): ev is UnifiedBridgeTransferStepChangeEvent =>
  ev.name === UnifiedBridgeEvent.TransferStepChange;
