import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type {
  MfaChoiceRequest,
  MfaRequestData,
  RecoveryMethod,
} from '../models';
import { SeedlessEvents } from '../models';

export function isSeedlessTokenEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<void> {
  return (
    evt?.name === SeedlessEvents.TokenExpired ||
    evt?.name === SeedlessEvents.TokenRefreshed
  );
}

export function isSeedlessMfaEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<MfaRequestData> {
  return (
    evt?.name === SeedlessEvents.MfaRequest ||
    evt?.name === SeedlessEvents.MfaFailure ||
    evt?.name === SeedlessEvents.MfaClear
  );
}

export function isSeedlessMfaMethodsUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<RecoveryMethod[]> {
  return evt?.name === SeedlessEvents.MfaMethodsUpdated;
}

export function isSeedlessMfaChoiceRequest(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<MfaChoiceRequest> {
  return evt?.name === SeedlessEvents.MfaChoiceRequest;
}
