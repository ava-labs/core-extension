import { Network } from '@core/types';
import { isAvalancheNetwork } from './isAvalancheNetwork';
import { isPchainNetwork } from './isAvalanchePchainNetwork';
import { isXchainNetwork } from './isAvalancheXchainNetwork';

export function isAvalanchePrimaryNetwork(network?: Network) {
  if (!network) return false;
  return (
    isAvalancheNetwork(network) ||
    isPchainNetwork(network) ||
    isXchainNetwork(network)
  );
}
