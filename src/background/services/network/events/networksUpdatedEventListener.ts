import type { ExtensionConnectionEvent } from '@src/background/connections/models';
import type { NetworkWithCaipId } from '../models';
import { NetworkEvents } from '../models';

export function networksUpdatedEventListener(
  evt: ExtensionConnectionEvent<{
    networks: NetworkWithCaipId[];
    activeNetwork?: NetworkWithCaipId;
    favoriteNetworks: number[];
    customNetworks: Record<number, NetworkWithCaipId>;
  }>,
) {
  return evt.name === NetworkEvents.NETWORKS_UPDATED_EVENT;
}
