import { ExtensionConnectionEvent, LockEvents } from '@core/types';

export function isLockStateChangedEvent(
  evt: ExtensionConnectionEvent<boolean>,
) {
  return evt.name === LockEvents.LOCK_STATE_CHANGED;
}
