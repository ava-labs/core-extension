import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Network, NetworkEvents } from '../models';

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<Network>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
