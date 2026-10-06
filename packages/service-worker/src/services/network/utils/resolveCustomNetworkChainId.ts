import { caipToChainId } from '@core/common';

type CustomNetworkIdentifiers = {
  chainId?: number | string;
  caipId?: string;
};

const toChainId = (value: number | string): number | undefined => {
  const parsed = typeof value === 'number' ? value : Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

/**
 * `chainId` and `caipId` are both optional on dApp payloads. One of them has to
 * identify the chain, and when both are present they have to agree — storage
 * is keyed by `chainId` while `getNetworkCaipId` prefers a supplied `caipId`.
 */
export const resolveCustomNetworkChainId = (
  network: CustomNetworkIdentifiers,
): number => {
  const hasChainId = network.chainId !== undefined && network.chainId !== '';
  const fromChainId = hasChainId ? toChainId(network.chainId!) : undefined;

  if (hasChainId && fromChainId === undefined) {
    throw new Error('Network is missing a usable chain ID');
  }

  const fromCaip = network.caipId
    ? toChainId(caipToChainId(network.caipId))
    : undefined;

  if (network.caipId && fromCaip === undefined) {
    throw new Error('Network is missing a usable chain ID');
  }

  if (
    fromChainId !== undefined &&
    fromCaip !== undefined &&
    fromChainId !== fromCaip
  ) {
    throw new Error('chainId does not match caipId');
  }

  const chainId = fromChainId ?? fromCaip;

  if (!chainId) {
    throw new Error('Network is missing a usable chain ID');
  }

  return chainId;
};
