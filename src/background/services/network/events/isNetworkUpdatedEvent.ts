import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { NetworkEvents, NetworkWithCaipId } from '../models';

export function isNetworkUpdatedEvent(
  evt: ExtensionConnectionEvent<NetworkWithCaipId>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
