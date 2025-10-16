import {
  ExtensionConnectionEvent,
  NetworkEvents,
  NetworkWithCaipId,
} from '@core/types';

export function networksUpdatedEventListener(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<{
  networks: NetworkWithCaipId[];
  activeNetwork?: NetworkWithCaipId;
  favoriteNetworks: number[];
  enabledNetworks: number[];
  customNetworks: Record<number, NetworkWithCaipId>;
}> {
  return evt.name === NetworkEvents.NETWORKS_UPDATED_EVENT;
}
