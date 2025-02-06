import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { NetworkWithCaipId } from '../models';
import { NetworkEvents } from '../models';

export function isNetworkUpdatedEvent(
  evt: ExtensionConnectionEvent<NetworkWithCaipId>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
