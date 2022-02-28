import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ActiveNetwork, FUJI_NETWORK } from '../network/models';

const providers: Record<string, StaticJsonRpcProvider> = {};

export function getAvalancheProvider(network?: ActiveNetwork | undefined) {
  const chainId = network?.chainId || FUJI_NETWORK.chainId;

  if (network && !providers[chainId]) {
    const avalancheProvider = new StaticJsonRpcProvider(
      network.config.rpcUrl.c
    );
    avalancheProvider.pollingInterval = 1000;
    providers[chainId] = avalancheProvider;
  }

  return providers[chainId];
}
