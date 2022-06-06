import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { LockEvents } from '../models';

export function lockStateChangedEventListener(
  evt: ExtensionConnectionEvent<boolean>
) {
  return evt.name === LockEvents.LOCK_STATE_CHANGED;
}
