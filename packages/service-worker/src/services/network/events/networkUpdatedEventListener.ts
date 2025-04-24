import {
  ExtensionConnectionEvent,
  Network,
  NetworkEvents,
} from '@core/types';

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<Network>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
