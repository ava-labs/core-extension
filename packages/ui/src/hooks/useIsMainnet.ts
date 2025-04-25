import { useNetworkContext } from '@/contexts/NetworkProvider';

export const useIsMainnet = () => {
  const { network } = useNetworkContext();
  return !network?.isTestnet;
};
