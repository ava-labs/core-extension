import { ExtensionConnectionEvent, LockEvents } from '@core/types';

export function isLockStateChangedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<boolean> {
  return evt.name === LockEvents.LOCK_STATE_CHANGED;
}
