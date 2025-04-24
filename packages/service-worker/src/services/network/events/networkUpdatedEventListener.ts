import { ExtensionConnectionEvent } from '../../../connections/models';
import { Network, NetworkEvents } from '@core/types/src/models';

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<Network>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
