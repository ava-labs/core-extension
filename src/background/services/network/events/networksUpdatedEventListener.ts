import { Network } from '@avalabs/chains-sdk';
import { ExtensionConnectionEvent } from '@src/background/connections/models';
import { NetworkEvents } from '../models';

export function networksUpdatedEventListener(
  evt: ExtensionConnectionEvent<{
    networks: Network[];
    activeNetwork: Network;
    isDeveloperMode: boolean;
    favoriteNetworks: number[];
    customNetworks: Record<number, Network>;
  }>
) {
  return evt.name === NetworkEvents.NETWORKS_UPDATED_EVENT;
}
