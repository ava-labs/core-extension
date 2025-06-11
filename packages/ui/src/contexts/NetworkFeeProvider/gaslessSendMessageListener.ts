import {
  ExtensionConnectionEvent,
  GaslessEvents,
  GaslessMessage,
} from '@core/types';

export function gaslessSendOffscreenMessageEventListener(
  evt: ExtensionConnectionEvent<GaslessMessage>,
) {
  return evt.name === GaslessEvents.SEND_OFFSCREEN_MESSAGE;
}
