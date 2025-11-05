import { isPchainNetworkId, isXchainNetworkId } from '@core/common';
import { NetworkWithCaipId } from '@core/types';

export function checkIfXorPChain(
  chainId: NetworkWithCaipId['chainId'],
): boolean {
  if (!chainId) {
    return false;
  }

  return isXchainNetworkId(chainId) || isPchainNetworkId(chainId);
}
