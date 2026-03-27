import type { Network } from '@core/types';
import { createContext, useContext, type FC, type ReactNode } from 'react';

const ActivityFilterNetworkContext = createContext<Network | undefined>(
  undefined,
);

type ProviderProps = {
  network: Network | undefined;
  children: ReactNode;
};

export const ActivityFilterNetworkProvider: FC<ProviderProps> = ({
  network,
  children,
}) => (
  <ActivityFilterNetworkContext.Provider value={network}>
    {children}
  </ActivityFilterNetworkContext.Provider>
);

export function useActivityFilterNetwork(): Network | undefined {
  return useContext(ActivityFilterNetworkContext);
}
