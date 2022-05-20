import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { ActiveNetwork, NetworkEvents } from '../models';

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<{
    activeNetwork: ActiveNetwork;
    isDeveloperMode: boolean;
  }>
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
