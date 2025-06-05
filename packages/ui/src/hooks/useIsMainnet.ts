import { useNetworkContext } from '../contexts';

export const useIsMainnet = () => {
  const { network } = useNetworkContext();
  return !network?.isTestnet;
};
