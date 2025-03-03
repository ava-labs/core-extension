import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GaslessChallange, GaslessEvents } from '../model';

export function gaslessChallangeUpdateEventListener(
  evt: ExtensionConnectionEvent<GaslessChallange>,
) {
  return evt.name === GaslessEvents.CHALLENGE_UPDATE;
}
