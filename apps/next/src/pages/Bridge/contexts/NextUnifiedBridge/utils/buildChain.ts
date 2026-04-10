import { Chain, TokenType } from '@avalabs/bridge-unified';
import { assert } from '@core/common';
import { CommonError, NetworkWithCaipId } from '@core/types';

export function buildChain(network: NetworkWithCaipId | undefined): Chain {
  assert(network, CommonError.UnknownNetwork);

  return {
    chainId: network.caipId,
    chainName: network.chainName,
    rpcUrl: network.rpcUrl,
    networkToken: {
      ...network.networkToken,
      type: TokenType.NATIVE,
    },
    utilityAddresses: {
      multicall: network.utilityAddresses?.multicall as `0x${string}`,
    },
  };
}
