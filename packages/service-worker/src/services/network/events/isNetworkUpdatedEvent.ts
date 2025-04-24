import { ExtensionConnectionEvent } from '../../../connections/models';
import { NetworkEvents, NetworkWithCaipId } from '@core/types';

export function isNetworkUpdatedEvent(
  evt: ExtensionConnectionEvent<NetworkWithCaipId>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
