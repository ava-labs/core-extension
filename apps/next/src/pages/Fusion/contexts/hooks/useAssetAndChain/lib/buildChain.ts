import {
  Caip2ChainId,
  Chain,
  TokenType,
} from '@avalabs/unified-asset-transfer';

import { NetworkWithCaipId } from '@core/types';

export const buildChain = (
  chainId: number,
  getNetwork: (chainId: number) => NetworkWithCaipId | undefined,
): Chain | undefined => {
  const network = getNetwork(chainId);

  if (!network) {
    return undefined;
  }

  return {
    networkToken: {
      decimals: network.networkToken.decimals,
      name: network.networkToken.name,
      symbol: network.networkToken.symbol,
      type: TokenType.NATIVE,
    },
    rpcUrl: network.rpcUrl,
    chainId: network.caipId as Caip2ChainId,
    chainName: network.chainName,
  };
};
