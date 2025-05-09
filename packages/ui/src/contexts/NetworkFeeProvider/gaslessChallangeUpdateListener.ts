import {
  ExtensionConnectionEvent,
  GaslessEvents,
  GaslessState,
} from '@core/types';

export function gaslessChallangeUpdateEventListener(
  evt: ExtensionConnectionEvent<GaslessState>,
) {
  return evt.name === GaslessEvents.STATE_UPDATE;
}
