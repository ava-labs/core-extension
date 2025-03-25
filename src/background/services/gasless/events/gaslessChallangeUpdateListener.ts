import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GaslessState, GaslessEvents } from '../model';

export function gaslessChallangeUpdateEventListener(
  evt: ExtensionConnectionEvent<GaslessState>,
) {
  return evt.name === GaslessEvents.STATE_UPDATE;
}
