import { Chain } from '@avalabs/fusion-sdk';

import {
  caipToChainId,
  isPchainNetworkId,
  isXchainNetworkId,
  stripAddressPrefix,
} from '@core/common';

export const formatAvalancheCctQuoteAddress = (
  address: string,
  chain: Chain,
) => {
  const chainId = caipToChainId(chain.chainId);

  if (isPchainNetworkId(chainId)) {
    return addAddressPrefix(address, 'P');
  }

  if (isXchainNetworkId(chainId)) {
    return addAddressPrefix(address, 'X');
  }

  return address;
};

const addAddressPrefix = (address: string, prefix: 'P' | 'X') =>
  address.startsWith(`${prefix}-`)
    ? address
    : `${prefix}-${stripAddressPrefix(address)}`;
