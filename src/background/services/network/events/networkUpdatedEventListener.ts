import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { Network } from '../models';
import { NetworkEvents } from '../models';

export function networkUpdatedEventListener(
  evt: ExtensionConnectionEvent<Network>,
) {
  return evt.name === NetworkEvents.NETWORK_UPDATE_EVENT;
}
