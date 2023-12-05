import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { SeedlessEvents } from '../models';

export function isSeedlessTokenEvent(
  evt: ExtensionConnectionEvent
): evt is ExtensionConnectionEvent<void> {
  return (
    evt?.name === SeedlessEvents.TokenExpired ||
    evt?.name === SeedlessEvents.TokenRefreshed
  );
}
