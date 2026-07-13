import type { NetworkWithCaipId } from '@core/types';

export const isChainIdRequested = (
  chainId: string | number,
  networks: NetworkWithCaipId[],
) => {
  const numericChainId = Number(chainId);
  return (
    networks.length === 0 ||
    networks.some((network) => network.chainId === numericChainId)
  );
};
