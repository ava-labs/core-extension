import { ExtensionConnectionEvent } from '../../../connections/models';
import { GaslessEvents, GaslessMessage } from '@core/types/src/model';

export function gaslessSendOffscreenMessageEventListener(
  evt: ExtensionConnectionEvent<GaslessMessage>,
) {
  return evt.name === GaslessEvents.SEND_OFFSCREEN_MESSAGE;
}
