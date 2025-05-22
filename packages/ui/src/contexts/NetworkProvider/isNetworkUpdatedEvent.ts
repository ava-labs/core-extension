import {
  ExtensionConnectionEvent,
  NetworkEvents,
  NetworkWithCaipId,
} from '@core/types';

export function isNetworkUpdatedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<NetworkWithCaipId> {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
