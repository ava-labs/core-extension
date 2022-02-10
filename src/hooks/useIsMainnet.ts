import { isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

export const useIsMainnet = () => {
  const { network } = useNetworkContext();
  return network ? isMainnetNetwork(network.config) : true;
};
