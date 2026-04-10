import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { FetchRequest, Network as EthersNetwork } from 'ethers';

import { NetworkWithCaipId } from '@core/types';
import { addGlacierAPIKeyIfNeeded } from '@core/common';

const MAX_CALLS = 40;

export const getEvmProvider = (network: NetworkWithCaipId) => {
  const fetchConfig = new FetchRequest(
    addGlacierAPIKeyIfNeeded(network.rpcUrl),
  );

  if (network.customRpcHeaders) {
    const headers = Object.entries(network.customRpcHeaders);

    for (const [name, value] of headers) {
      fetchConfig.setHeader(name, value);
    }
  }

  const provider = new JsonRpcBatchInternal(
    MAX_CALLS,
    fetchConfig,
    new EthersNetwork(network.chainName, network.chainId),
  );

  provider.pollingInterval = 2000;

  return provider;
};
