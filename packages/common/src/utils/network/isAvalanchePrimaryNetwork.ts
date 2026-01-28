import { NetworkWithCaipId } from '@core/types';
import { isAvalancheNetwork } from './isAvalancheNetwork';
import { isPchainNetwork } from './isAvalanchePchainNetwork';
import { isXchainNetwork } from './isAvalancheXchainNetwork';

export function isAvalanchePrimaryNetwork(network?: NetworkWithCaipId) {
  if (!network) return false;
  return (
    isAvalancheNetwork(network) ||
    isPchainNetwork(network) ||
    isXchainNetwork(network)
  );
}
