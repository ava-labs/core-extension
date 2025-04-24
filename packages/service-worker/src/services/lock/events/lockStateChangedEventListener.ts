import { ExtensionConnectionEvent, LockEvents } from '@core/types';

export function lockStateChangedEventListener(
  evt: ExtensionConnectionEvent<boolean>,
) {
  return evt.name === LockEvents.LOCK_STATE_CHANGED;
}
