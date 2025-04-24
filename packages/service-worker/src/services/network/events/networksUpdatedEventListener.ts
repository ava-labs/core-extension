import { ExtensionConnectionEvent } from '../../../connections/models';
import { NetworkEvents, NetworkWithCaipId } from '@core/types/src/models';

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
