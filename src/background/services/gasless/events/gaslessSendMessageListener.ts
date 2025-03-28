import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GaslessEvents, GaslessMessage } from '../model';

export function gaslessSendOffscreenMessageEventListener(
  evt: ExtensionConnectionEvent<GaslessMessage>,
) {
  return evt.name === GaslessEvents.SEND_OFFSCREEN_MESSAGE;
}
