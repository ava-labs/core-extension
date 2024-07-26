import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { Network, NetworkEvents } from '../models';

export function networksUpdatedEventListener(
  evt: ExtensionConnectionEvent<{
    networks: Network[];
    activeNetwork?: Network;
    favoriteNetworks: number[];
    customNetworks: Record<number, Network>;
  }>
) {
  return evt.name === NetworkEvents.NETWORKS_UPDATED_EVENT;
}
