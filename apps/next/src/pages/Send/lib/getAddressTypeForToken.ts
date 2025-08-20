import {
  isBitcoinChainId,
  isPchainNetworkId,
  isSolanaChainId,
  isXchainNetworkId,
} from '@core/common';
import { AddressType, FungibleTokenBalance } from '@core/types';

export const getAddressTypeForToken = (
  token: FungibleTokenBalance,
): AddressType => getAddressTypeForCoreChainId(token.coreChainId);

const getAddressTypeForCoreChainId = (chainId: number): AddressType => {
  if (isBitcoinChainId(chainId)) {
    return 'BTC';
  }

  if (isPchainNetworkId(chainId)) {
    return 'PVM';
  }

  if (isXchainNetworkId(chainId)) {
    return 'AVM';
  }

  if (isSolanaChainId(chainId)) {
    return 'SVM';
  }

  return 'C';
};
