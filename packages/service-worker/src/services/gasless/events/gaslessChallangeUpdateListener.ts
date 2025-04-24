import { ExtensionConnectionEvent } from '../../../connections/models';
import { GaslessState, GaslessEvents } from '@core/types/src/model';

export function gaslessChallangeUpdateEventListener(
  evt: ExtensionConnectionEvent<GaslessState>,
) {
  return evt.name === GaslessEvents.STATE_UPDATE;
}
