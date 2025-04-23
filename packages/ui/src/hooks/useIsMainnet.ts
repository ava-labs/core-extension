import { useNetworkContext } from '@src/contexts/NetworkProvider';

export const useIsMainnet = () => {
  const { network } = useNetworkContext();
  return !network?.isTestnet;
};
