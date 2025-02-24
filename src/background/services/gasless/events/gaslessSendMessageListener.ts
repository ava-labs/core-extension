import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { GaslessEvents, GaslessMessage } from '../model';

export function gaslessSendMessageEventListener(
  evt: ExtensionConnectionEvent<GaslessMessage>,
) {
  return evt.name === GaslessEvents.SEND_MESSAGE;
}
