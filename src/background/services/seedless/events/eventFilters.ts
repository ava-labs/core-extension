import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { MfaRequestData, SeedlessEvents } from '../models';

export function isSeedlessTokenEvent(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<void> {
  return (
    evt?.name === SeedlessEvents.TokenExpired ||
    evt?.name === SeedlessEvents.TokenRefreshed
  );
}

export function isSeedlessMfaEvent(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<MfaRequestData> {
  return (
    evt?.name === SeedlessEvents.MfaRequest ||
    evt?.name === SeedlessEvents.MfaFailure
  );
}
